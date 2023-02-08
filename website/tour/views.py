from django.views.generic import TemplateView
from configparser import ConfigParser

config = ConfigParser()
config.read('secret.conf')

class TourListView(TemplateView):
    template_name = "TourList.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['TourListApiKey'] = config.get('main', 'api_key')
        return context