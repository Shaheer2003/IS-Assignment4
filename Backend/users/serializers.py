from rest_framework import serializers
from django.contrib.auth.models import User, Group

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['name']

class UserSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'groups', 'first_name', 'last_name', 'password', 'role']

    def create(self, validated_data):
        password = validated_data.pop('password')
        role_name = validated_data.pop('role', None)
        
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()

        if role_name:
            try:
                group = Group.objects.get(name=role_name)
                user.groups.add(group)
            except Group.DoesNotExist:
                pass # Or raise validation error
        
        return user
