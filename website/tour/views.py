from django.views.generic import TemplateView
from django.http import JsonResponse
from configparser import ConfigParser
from .models import RoutePoint

config = ConfigParser()
config.read('secret.conf')

class IndexView(TemplateView):
    template_name = "index.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['routePoints'] = RoutePoint.objects.all()
        context['octantApiKey'] = config.get('main', 'api_key')
        return context
    
    def post(self, request, *args, **kwargs):
        if request.POST.get('reason') == 'addPoint':
            newPoint = RoutePoint(pointName=request.POST.get("pointName"), pointId=request.POST.get("pointId"))
            newPoint.save()
            print(f'Добавлена точка "{newPoint.pointName}", ID {newPoint.pointId}.')
            return JsonResponse({'pointName': newPoint.pointName, 'pointId': newPoint.pointId, 'pointIdTrue': newPoint.id})
        context = self.get_context_data(**kwargs)
        return self.render_to_response(context)