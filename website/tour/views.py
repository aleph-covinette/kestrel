from django.views.generic import TemplateView
from django.http import JsonResponse
from configparser import ConfigParser
from .models import Point, Route
import time

config = ConfigParser()
config.read('secret.conf')

class IndexView(TemplateView):
    template_name = "index.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['points'] = Point.objects.all().order_by('pos')
        context['routes'] = Route.objects.all().order_by('pos')
        context['secret'] = config.get('main', 'api_key')
        return context
    
    def post(self, request, *args, **kwargs):
        if request.POST.get('source') == 'point':
            if request.POST.get('reason') == 'add':
                point = Point(
                    name = request.POST.get('name'), 
                    poi = request.POST.get('poi'), 
                    pos = 1 + max([i[0] for i in Point.objects.values_list('pos')] + [-1])
                ).save()
            if request.POST.get('reason') == 'remove':
                t = Point.objects.filter(pos=request.POST.get('poi'))[0]
                for point in Point.objects.all():
                    if point.pos > t.pos:
                        point.pos -= 1
                        point.save()
                t.delete()
            if request.POST.get('reason') == 'update':
                newPos = request.POST.getlist('entries[]')
                oldObs = []
                s = 0
                for point in range(len(newPos)):
                    oldObs.append(Point.objects.filter(pos=int(point))[0])
                for point in newPos:
                    oldObs[int(point)].pos = s
                    oldObs[int(point)].save()
                    s += 1
            if request.POST.get('reason') == 'addm':
                names, pois = request.POST.getlist('name[]'), request.POST.getlist('poi[]')
                for i in range(len(names)):
                    point = Point(
                        name = names[i],
                        poi = pois[i],
                        pos = 1 + max([i[0] for i in Point.objects.values_list('pos')] + [-1])
                    ).save()
            return JsonResponse({'elements': [{'pos': i.pos, 'name': i.name} for i in Point.objects.all().order_by('pos')]})
        if request.POST.get('source') == 'route':
            if request.POST.get('reason') == 'remove':
                t = Route.objects.filter(pos=request.POST.get('pos'))[0]
                for route in Route.objects.all():
                    if route.pos > t.pos:
                        route.pos -= 1
                        route.save()
                t.delete()
            if request.POST.get('reason') == 'update':
                newPos = request.POST.getlist('entries[]')
                oldObs = []
                s = 0
                for point in range(len(newPos)):
                    oldObs.append(Route.objects.filter(pos=int(point))[0])
                for point in newPos:
                    oldObs[int(point)].pos = s
                    oldObs[int(point)].save()
                    s += 1
            if request.POST.get('reason') == 'translate':
                obs = Point.objects.all().delete()
                time.sleep(1)
                ob = Route.objects.filter(pos=request.POST.get('pos'))[0]
                return JsonResponse({'elements': ob.poi})
            if request.POST.get('reason') == 'reload':
                print(Point.objects.values_list('pos'))
                return JsonResponse({'elements': [{'pos': i.pos, 'name': i.name} for i in Point.objects.all().order_by('pos')]})
            return JsonResponse({'elements': [{'pos': i.pos, 'dist': i.dist, 'time': i.time, 'name1': i.name1, 'name2': i.name2} for i in Route.objects.all().order_by('pos')]})
        context = self.get_context_data(**kwargs)
        return self.render_to_response(context)

class RouteView(TemplateView):
    template_name = "route.html"
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        points = Point.objects.all().order_by('pos')
        context['secret'] = config.get('main', 'api_key')
        context['points'] = [p.poi for p in points]
        return context

    def post(self, request, *args, **kwargs):
        if request.POST.get('reason') == 'add':
            newPos = 0 if len(Route.objects.values_list('pos', flat=True)) == 0 else max([i for i in Route.objects.values_list('pos', flat=True)]) + 1
            newRoute = Route(
                poi=request.POST.getlist('id[]'),
                dist=request.POST.getlist('dist')[0],
                time=request.POST.getlist('time')[0],
                pos=newPos,
                name1=request.POST.get('name1'),
                name2=request.POST.get('name2')
            )
            newRoute.save()
            return JsonResponse({})
