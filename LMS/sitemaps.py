from django.contrib.sitemaps import Sitemap
from .models import *


class SectionsSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.7

    def items(self):
       return Section.objects.all()

    def lastmod(self, obj):
       return obj.updated



class SubjectSitemap(Sitemap):
    #class-11-Mathematics
    changefreq = "weekly"
    priority = 0.8

    def items(self):
       return Subject.objects.all()

    def lastmod(self, obj):
       return obj.updated


class NotesSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8

    def items(self):
       return Note.objects.all()
