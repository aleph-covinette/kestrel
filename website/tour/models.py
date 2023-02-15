from django.db import models

class RoutePoint(models.Model):
    name = models.CharField(max_length=50)
    point = models.IntegerField(default=-1)
    pos = models.IntegerField(default=-1)
