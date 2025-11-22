from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from patients.models import Patient
from logs.models import AccessLog

class Command(BaseCommand):
    help = 'Setup initial groups and permissions'

    def handle(self, *args, **kwargs):
        # Create Groups
        admin_group, _ = Group.objects.get_or_create(name='Admin')
        doctor_group, _ = Group.objects.get_or_create(name='Doctor')
        receptionist_group, _ = Group.objects.get_or_create(name='Receptionist')

        # Define Permissions
        patient_ct = ContentType.objects.get_for_model(Patient)
        log_ct = ContentType.objects.get_for_model(AccessLog)

        # Admin Permissions: All on Patients and Logs
        admin_perms = Permission.objects.filter(content_type__in=[patient_ct, log_ct])
        admin_group.permissions.set(admin_perms)

        # Doctor Permissions: View Patients (Logic handled in views for "Assigned Only")
        # We give them 'view_patient' permission.
        view_patient = Permission.objects.get(codename='view_patient', content_type=patient_ct)
        doctor_group.permissions.add(view_patient)

        # Receptionist Permissions: Add Patient, View Patient (Basic), Change Patient (Assign Doctor)
        add_patient = Permission.objects.get(codename='add_patient', content_type=patient_ct)
        change_patient = Permission.objects.get(codename='change_patient', content_type=patient_ct)
        receptionist_group.permissions.add(add_patient, view_patient, change_patient)

        self.stdout.write(self.style.SUCCESS('Successfully setup groups and permissions'))
