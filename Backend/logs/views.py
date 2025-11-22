from rest_framework import viewsets, permissions
from .models import AccessLog
from .serializers import AccessLogSerializer

import csv
from django.http import HttpResponse
from rest_framework.decorators import action

class AccessLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AccessLog.objects.all().order_by('-timestamp')
    serializer_class = AccessLogSerializer
    permission_classes = [permissions.IsAdminUser] # Only admin can view logs

    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="audit_logs.csv"'

        writer = csv.writer(response)
        writer.writerow(['Timestamp', 'User', 'Action', 'Details'])

        logs = self.get_queryset()
        for log in logs:
            writer.writerow([log.timestamp, log.user.username if log.user else 'Unknown', log.action, log.details])

        return response
