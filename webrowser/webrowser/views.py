from django.http import HttpResponse
from tokenapi.http import JsonResponse, JsonError
from tokenapi.decorators import token_required
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.conf import settings
import os
import subprocess
import json

def home(request):
    return render(request, template_name="index.html")

@token_required
def get_list(request):
    base_dir = request.POST["path"] if "path" in request.POST else settings.DIR_INIT
    if settings.DIR_INIT not in base_dir:
        base_dir = settings.DIR_INIT
    os.chdir(base_dir  )
    contenido  = os.listdir(base_dir)
    res = {"path":base_dir, 'items':[]}
    for s in contenido:
        if not s.startswith('.') and s != "lost+found":
            if os.path.isfile(s):
                res["items"].append({'nombre':s, "tipo": "file", "selected": False})
            else:
                res["items"].append({'nombre':s, "tipo": "dir", "selected": False})
            

    return JsonResponse(res)

@token_required
def new_folder(request):
    try:
        base_dir = request.POST["path"] if "path" in request.POST else settings.DIR_INIT
        name_folder = request.POST["nombre"]
        os.chdir(base_dir)
        os.mkdir(name_folder)
    except Exception as e:
        return JsonError(str(e))

    return JsonResponse({"nombre": name_folder, "tipo": "dir"})

@token_required
def rename(request):
    try:  
        old_name = request.POST["old_name"]
        new_name = request.POST["new_name"]
        subprocess.call("mv '%s' '%s'" % (old_name, new_name), shell=True)
    except Exception as e:
        return JsonError(str(e))

    return JsonResponse({})

@token_required
def mv(request):
    try:
        source = request.POST["src"]
        destino = request.POST["des"]
        files = json.loads(request.POST["files"])
        for f in files:
            subprocess.call("mv '{0}/{2}' '{1}/{2}'".format(source, destino, f), shell=True)
    except Exception as e:
        return JsonError(str(e))

    return JsonResponse({})

@token_required
def remove(request):
    try:
        path = request.POST["path"]  
        files = json.loads(request.POST["files"])
        for f in files:
            subprocess.call("rm -Rf '%s/%s'" % (path, f), shell=True)

    except Exception as e:
        return JsonError(str(e))

    return JsonResponse({})

@token_required
def get_list_dir(request):
    base_dir = request.POST["path"] if "path" in request.POST else settings.DIR_INIT
    nombres = json.loads(request.POST["nombres"])
    if settings.DIR_INIT not in base_dir:
        base_dir = settings.DIR_INIT
    os.chdir(base_dir)
    contenido  = os.listdir(base_dir)
    res = {"path":base_dir, 'items':[]}
    for s in contenido:
        if not s.startswith('.') and s != "lost+found":
            if not os.path.isfile(s) and s not in nombres:
                res["items"].append({'nombre':s, "tipo": "dir", "selected": False})
        
    return JsonResponse(res)