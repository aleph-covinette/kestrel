from django.db import models

class RoutePoint(models.Model):
    pointName = models.CharField(max_length=50)
    pointId = models.IntegerField(default=-1)