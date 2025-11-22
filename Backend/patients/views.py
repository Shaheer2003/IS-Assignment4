from rest_framework import viewsets, permissions
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Patient
from .serializers import PatientSerializer
from logs.models import AccessLog

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.groups.filter(name='Admin').exists():
            return Patient.objects.all()
        elif user.groups.filter(name='Doctor').exists():
            return Patient.objects.filter(assigned_doctor=user)
        elif user.groups.filter(name='Receptionist').exists():
            return Patient.objects.all() # Receptionist sees all to register/check, but fields are restricted in serializer
        return Patient.objects.none()

    def perform_create(self, serializer):
        # Restrict creation to Admin only
        if not self.request.user.groups.filter(name='Admin').exists():
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only Admins can register new patients.")

        # Log the action
        AccessLog.objects.create(
            user=self.request.user,
            action="CREATE_PATIENT",
            details=f"Created patient record"
        )
        serializer.save()

    def perform_update(self, serializer):
        user = self.request.user
        patient_id = serializer.instance.id
        
        # Determine if user is Receptionist
        is_receptionist = user.groups.filter(name='Receptionist').exists()
        is_admin = user.groups.filter(name='Admin').exists()
        
        if is_receptionist:
            # Receptionist only updates assigned doctor
            AccessLog.objects.create(
                user=user,
                action="UPDATE_PATIENT_DOCTOR",
                details=f"Receptionist updated assigned doctor for patient {patient_id}"
            )
        elif is_admin:
            # Admin can update all fields
            AccessLog.objects.create(
                user=user,
                action="UPDATE_PATIENT_FULL",
                details=f"Admin updated patient {patient_id} details"
            )
        else:
            # Generic update for other roles
            AccessLog.objects.create(
                user=user,
                action="UPDATE_PATIENT",
                details=f"Updated patient {patient_id}"
            )
        
        serializer.save()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Log the view action
        AccessLog.objects.create(
            user=request.user,
            action="VIEW_PATIENT",
            details=f"Viewed patient {instance.id}"
        )
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
