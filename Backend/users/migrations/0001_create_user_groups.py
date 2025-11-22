# Generated data migration to create user groups and assign superusers

from django.db import migrations


def create_groups_and_assign_superusers(apps, schema_editor):
    """
    Create the three user groups (Admin, Doctor, Receptionist)
    and automatically assign all superusers to the Admin group.
    """
    Group = apps.get_model('auth', 'Group')
    User = apps.get_model('auth', 'User')
    
    # Create the three groups
    admin_group, _ = Group.objects.get_or_create(name='Admin')
    doctor_group, _ = Group.objects.get_or_create(name='Doctor')
    receptionist_group, _ = Group.objects.get_or_create(name='Receptionist')
    
    print("✓ Created user groups: Admin, Doctor, Receptionist")
    
    # Assign all superusers to the Admin group
    superusers = User.objects.filter(is_superuser=True)
    for user in superusers:
        user.groups.add(admin_group)
        print(f"✓ Assigned superuser '{user.username}' to Admin group")
    
    if not superusers.exists():
        print("ℹ No superusers found. Create a superuser and they will be automatically assigned to Admin group on next migration.")


def reverse_groups(apps, schema_editor):
    """
    Reverse migration: Remove the groups.
    Note: This will not remove group assignments, just the groups themselves.
    """
    Group = apps.get_model('auth', 'Group')
    
    Group.objects.filter(name__in=['Admin', 'Doctor', 'Receptionist']).delete()
    print("✓ Removed user groups: Admin, Doctor, Receptionist")


class Migration(migrations.Migration):

    dependencies = [
        # This migration depends on Django's auth app being migrated
        ('auth', '__latest__'),
    ]

    operations = [
        migrations.RunPython(
            create_groups_and_assign_superusers,
            reverse_code=reverse_groups
        ),
    ]
