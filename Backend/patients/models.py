from django.db import models
from django.contrib.auth.models import User
from .utils import encrypt_data, decrypt_data

import uuid

class Patient(models.Model):
    # Encrypted fields
    name = models.TextField()
    diagnosis = models.TextField()
    
    # Regular fields
    age = models.IntegerField()
    contact = models.CharField(max_length=100) # Renamed from contact_info
    assigned_doctor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_patients')
    date_added = models.DateTimeField(auto_now_add=True) # Renamed from created_at
    
    # Anonymized fields
    anonymized_name = models.CharField(max_length=100, blank=True)
    anonymized_contact = models.CharField(max_length=100, blank=True)

    def save(self, *args, **kwargs):
        # Auto-generate anonymized data if missing
        if not self.anonymized_name:
            self.anonymized_name = f"Patient-{uuid.uuid4().hex[:8].upper()}"
        
        if not self.anonymized_contact:
            # Simple masking: "1234567890" -> "******7890"
            if self.contact and len(self.contact) > 4:
                self.anonymized_contact = "*" * (len(self.contact) - 4) + self.contact[-4:]
            else:
                self.anonymized_contact = "******"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Patient {self.id} ({self.anonymized_name})"
