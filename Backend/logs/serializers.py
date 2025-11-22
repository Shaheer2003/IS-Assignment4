from rest_framework import serializers
from .models import AccessLog

class AccessLogSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = AccessLog
        fields = '__all__'
