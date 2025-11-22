from django.contrib import admin
from .models import Patient
from .utils import decrypt_data

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_decrypted_name', 'anonymized_name', 'age', 'contact', 'anonymized_contact', 'assigned_doctor', 'date_added')
    search_fields = ('contact', 'assigned_doctor__username', 'anonymized_name')
    list_filter = ('assigned_doctor', 'date_added')

    def get_decrypted_name(self, obj):
        try:
            return decrypt_data(obj.name)
        except:
            return "[Encrypted]"
    get_decrypted_name.short_description = 'Name'

    # We can also show diagnosis decrypted if needed, but let's keep it safe or optional
    # For now, just showing name decrypted for better usability
