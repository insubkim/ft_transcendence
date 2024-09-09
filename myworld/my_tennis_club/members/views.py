from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from .models import Member

# Create your views here.
def members(request):
  return HttpResponse("HELLO WORLD!")

def hello_insub(request):
  return HttpResponse("Hello INSUB! NICE TO MEET YOU")

def my_first_html(request):
  template = loader.get_template("myfirst.html")
  return HttpResponse(template.render())

def all_member(request):
  mymembers = Member.objects.all().values()
  template = loader.get_template("all_member.html")
  context = {
    'mymembers' : mymembers,
  }
  return HttpResponse(template.render(context, request))

def details(request, id):
  mymembers = Member.objects.get(id=id)
  template = loader.get_template("details.html")
  context = {
    'member' : mymembers,
  }
  return HttpResponse(template.render(context, request))


def all_member_master(request):
  mymembers = Member.objects.all().values()
  template = loader.get_template("all_member_master.html")
  context = {
    'mymembers' : mymembers,
  }
  return HttpResponse(template.render(context, request))

def details_master(request, id):
  mymembers = Member.objects.get(id=id)
  template = loader.get_template("details_master.html")
  context = {
    'member' : mymembers,
  }
  return HttpResponse(template.render(context, request))

def main(request):
  template = loader.get_template("main.html")
  return HttpResponse(template.render())

def test(request):
  template = loader.get_template("test.html")
  return HttpResponse(template.render())

def dom(request):
  template = loader.get_template("dom.html")
  return HttpResponse(template.render())

def spa(request):
  template = loader.get_template("spa.html")
  return HttpResponse(template.render())

def test_nav(request):
  template = loader.get_template("test_nav.html")
  return HttpResponse(template.render())

def pong(request):
  template = loader.get_template("pong.html")
  return HttpResponse(template.render())

def pong_multi(request):
  template = loader.get_template("pong_multi.html")
  return HttpResponse(template.render())

def three(request):
  template = loader.get_template("three.html")
  return HttpResponse(template.render())

def pong_main(request):
  template = loader.get_template("pong_main.html")
  return HttpResponse(template.render())