from rest_framework import viewsets, permissions, status, views
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .serializers import UserSerializer

from rest_framework.decorators import action

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser] # Default for CRUD

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def doctors(self, request):
        """
        List all users who are in the 'Doctor' group.
        Accessible to any authenticated user (e.g. Receptionist).
        """
        doctors = User.objects.filter(groups__name='Doctor')
        serializer = self.get_serializer(doctors, many=True)
        return Response(serializer.data)

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)

        if user:
            login(request, user)
            
            # Log successful login
            from logs.models import AccessLog
            AccessLog.objects.create(
                user=user,
                action="USER_LOGIN",
                details=f"User {username} logged in successfully"
            )
            
            serializer = UserSerializer(user)
            return Response(serializer.data)
        
        # Note: We don't log failed login attempts to avoid filling logs with brute force attempts
        # But you could add that if needed
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(views.APIView):
    def post(self, request):
        # Log logout before actually logging out
        if request.user.is_authenticated:
            from logs.models import AccessLog
            AccessLog.objects.create(
                user=request.user,
                action="USER_LOGOUT",
                details=f"User {request.user.username} logged out"
            )
        
        logout(request)
        return Response({'message': 'Logged out successfully'})

class CurrentUserView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
