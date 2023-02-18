from django.db import models

class Point(models.Model):
    name = models.CharField(max_length=50)
    poi = models.IntegerField(default=-1)
    pos = models.IntegerField(default=-1)

class Route(models.Model):
    poi = models.JSONField()
    name1 = models.CharField(max_length=100)
    name2 = models.CharField(max_length=100)
    dist = models.CharField(max_length=100)
    time = models.CharField(max_length=100)
    pos = models.IntegerField(default=-1)

class Limit(models.Model):
    time = models.IntegerField(default=-1)