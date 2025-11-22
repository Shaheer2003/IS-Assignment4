from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Patient
from .utils import decrypt_data
from users.serializers import UserSerializer

class PatientSerializer(serializers.ModelSerializer):
    assigned_doctor_name = serializers.ReadOnlyField(source='assigned_doctor.username')

    class Meta:
        model = Patient
        fields = '__all__'
        extra_kwargs = {
            'diagnosis': {'required': False, 'allow_blank': True},  # Allow empty for Receptionist updates
        }
    
    def validate(self, data):
        """
        Custom validation to ensure diagnosis is provided for Admin/Doctor,
        but allow Receptionist to skip it during updates.
        """
        request = self.context.get('request')
        is_receptionist = request and request.user.groups.filter(name='Receptionist').exists()
        
        # If it's an update and user is Receptionist, allow empty/missing diagnosis
        if self.instance and is_receptionist:
            # Receptionist updating - diagnosis can be blank or missing
            return data
        
        # If it's a create operation (no instance) and not from receptionist, require diagnosis
        if not self.instance and not is_receptionist:
            if 'diagnosis' not in data or not data.get('diagnosis', '').strip():
                raise serializers.ValidationError({'diagnosis': 'This field is required.'})
        
        return data

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        request = self.context.get('request')
        if not request:
            return ret

        user = request.user
        is_admin = user.groups.filter(name='Admin').exists()
        is_doctor = user.groups.filter(name='Doctor').exists()
        is_receptionist = user.groups.filter(name='Receptionist').exists()

        # Decrypt data
        try:
            real_name = decrypt_data(instance.name)
            real_diagnosis = decrypt_data(instance.diagnosis)
        except Exception:
            real_name = "Error Decrypting"
            real_diagnosis = "Error Decrypting"

        # Common fields are already in ret (age, date_added, assigned_doctor, anonymized_*)
        # We just need to override/remove sensitive ones based on role.

        if is_admin:
            # Admin sees EVERYTHING
            ret['name'] = real_name
            ret['diagnosis'] = real_diagnosis
            # contact is already there
        
        elif is_doctor:
            # Doctor sees Anonymized Data + Diagnosis
            # MUST NOT see real name or contact
            ret.pop('name', None)
            ret.pop('contact', None)
            ret['diagnosis'] = real_diagnosis
        
        elif is_receptionist:
            # Receptionist sees Real Name/Contact but NO Diagnosis
            ret['name'] = real_name
            ret['diagnosis'] = "RESTRICTED"
            # contact is already there
        
        return ret

    def create(self, validated_data):
        # Encrypt data on creation
        # Note: The model save method handles encryption, but we can also do it here to be explicit
        # However, our model.save() logic was "if not encrypted, encrypt".
        # Let's rely on the utils helper in the view or model.
        # Actually, better to do it here to ensure what gets passed to model is already encrypted 
        # OR let the model handle it. 
        # Given the model implementation, we should ensure we pass raw data and model encrypts it?
        # Wait, the model implementation I wrote checks "if not data: return".
        # And "if it doesn't look like fernet...".
        # Let's explicitly encrypt here to be safe.
        from .utils import encrypt_data
        if 'name' in validated_data:
            validated_data['name'] = encrypt_data(validated_data['name'])
        if 'diagnosis' in validated_data:
            validated_data['diagnosis'] = encrypt_data(validated_data['diagnosis'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        if request and request.user.groups.filter(name='Receptionist').exists():
            # Receptionist can ONLY update assigned_doctor
            # We ignore all other fields in validated_data
            new_doctor = validated_data.get('assigned_doctor')
            if new_doctor is not None:
                instance.assigned_doctor = new_doctor
                instance.save()
            return instance
        
        # For Admin (or others), proceed with full update
        from .utils import encrypt_data
        if 'name' in validated_data:
            validated_data['name'] = encrypt_data(validated_data['name'])
        if 'diagnosis' in validated_data:
            validated_data['diagnosis'] = encrypt_data(validated_data['diagnosis'])
        return super().update(instance, validated_data)
