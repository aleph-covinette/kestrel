from django.views.generic import TemplateView

class TourListView(TemplateView):
    template_name = "tour-list.html"