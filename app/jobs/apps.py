from django.apps import AppConfig

class JobsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app.jobs'

    def ready(self):
        # Jab Django start ho toh signals ko load kar lo
        import app.jobs.signals
