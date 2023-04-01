
<template>
 <v-app>
    <v-app-bar title="Web Browser">
      <v-spacer></v-spacer>
      <v-sheet v-if="token" class="mr-3">
          <v-btn icon="mdi-trash-can"
            v-if="seleccionados.length > 0" 
            @click="showRemove = true; "> 
            </v-btn>
          <v-btn icon="mdi-folder-move"
          v-if="seleccionados.length > 0" 
          @click="showMove = true; store.get_list_dir(seleccionados)"> 
          </v-btn>
          <v-btn icon="mdi-folder-plus" @click="showNewDialog = true"></v-btn>
      </v-sheet>
        
    </v-app-bar>
    <v-main v-if="!token" class="">
        <v-card class="w-75  mt-16 mx-auto">
            <v-card-title class="bg-blue" >Identificate</v-card-title>
            <v-card-text class="pa-5">
                <v-text-field v-model="user" placeholder="Usuario"></v-text-field>
                <v-text-field v-model="password" type="password" placeholder="Password"></v-text-field>
                <v-alert v-if="store.error" color="warning">Credenciales erroneas.</v-alert>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="store.get_token(user, password);">Aceptar</v-btn>
            </v-card-actions>
        </v-card>
    </v-main>
    <v-main v-else>
        <v-row class="pa-5 mt-2">
            <v-col cols="12"><v-breadcrumbs :items="levels"></v-breadcrumbs></v-col>
            <!--- Salir del directorio. -->
            <v-col cols="12" v-if="levels.length > 1"  >
              <v-card elevation="3">
                  <v-card-text >
                      <v-row >
                        <v-col cols="2" md="1" class="mt-4 text-center">
                            <v-btn icon="mdi-arrow-up-thin" @click="enter_folder()"></v-btn>
                          </v-col>
                        <v-col cols="10" md="11" class="text-h3">..</v-col>
                      </v-row>
                  </v-card-text>
              </v-card>
            </v-col>
            <!--- Lista de directorios y ficheros... -->
            <v-col cols="12" v-for="f, i in items" :key="i" >
              <v-card elevation="3">
                  <v-card-text >
                      <v-row >
                        <v-col cols="2" md="1" class="text-center">
                            <v-btn @click="enter_folder(f)" icon="mdi-folder" v-if="f.tipo == 'dir' ">
                            </v-btn>
                            <v-icon class="mt-5" size="x-large" v-else>mdi-file-account-outline</v-icon>
                          </v-col>
                        <v-col cols="8"  md="10" class="text-right"> 
                          <v-checkbox @click="selected(f)"  v-model="f.selected" 
                                      :label="f.nombre" hide-details> 
                                    </v-checkbox>
                                  
                        </v-col>
                        <v-col cols="2" md="1">
                          <v-menu>
                            <template v-slot:activator="{ props }">
                              <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
                            </template>
                            <v-list>
                              <v-list-item @click="rename(f)"><v-icon>mdi-pencil</v-icon> Renombrar </v-list-item>
                              <v-list-item  @click="remove(f)"><v-icon>mdi-trash-can</v-icon> Borrar </v-list-item >
                              <v-list-item   @click="mv(f)"><v-icon>mdi-folder-move</v-icon> Mover </v-list-item >
                            </v-list>
                          </v-menu>
                          
                        
                          
                        </v-col>
                        </v-row>
                  </v-card-text>
              </v-card>
            </v-col>
        </v-row>
         <!--- Diaolog de crear directorio. -->
        <v-dialog
            v-model="showNewDialog"
            width="auto"
          >
          <v-card title="Crear directorio">
            <v-card-text>
                <v-form @submit.prevent>
                  <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                    >
                    <v-text-field
                        v-model="folder_name"
                        :rules="nameRules"
                        label="Nombre"
                        required
                      ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-btn @click="showNewDialog=false; folder_name = ''">Cancelar</v-btn>
                    <v-btn type="submit" @click="newfolder()">Aceptar</v-btn>
                  </v-container>
              </v-form>
            </v-card-text>
            
          </v-card>
        </v-dialog>

        <!--- Dialogo para renombrar -->
        <v-dialog
            v-model="showRename"
            width="auto"
          >
          <v-card >
            <v-card-title class="bg-blue">Renombrar</v-card-title>
            <v-card-text>
                <v-form @submit.prevent>
                  <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                    >
                    <v-text-field
                        v-model="name_edit"
                        :rules="nameRules"
                        label="Renombrar"
                        required
                        width="auto"
                      ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-btn @click="showRename=false; name_edit = ''; fSel = null">Cancelar</v-btn>
                    <v-btn  type="submit" @click="rename()">Aceptar</v-btn>
                  </v-container>
              </v-form>
            </v-card-text>
            
          </v-card>
        </v-dialog>

        <!--- Dialogo para borrar -->
        <v-dialog
            v-model="showRemove"
            width="auto"
          >
          <v-card >
            <v-card-title class="bg-blue">Atención!!!! cuidado..</v-card-title>
            <v-card-text>
              
                  <v-row>
                    <v-col
                      cols="12"
                      
                    >
                      <v-alert  color="warning">
                        <h3 class="text-uppercase"> Seguro que quieres borrar el contenido
                          <p v-for="k,i in seleccionados" :key="i" >{{k}}</p>  
                          <br/>Esto se borrara  PARA SIEMPRE</h3>
                      </v-alert>   
                      </v-col>
                      <v-col cols="12">
                          <v-btn @click="showRemove=false;">Cancelar</v-btn>
                          <v-btn @click="remove()">Aceptar</v-btn>
                      </v-col>
                    </v-row>
            </v-card-text>
            
          </v-card>
        </v-dialog>

        <!--- Dialogo para mover -->
        <v-dialog
            v-model="showMove"
            width="auto"
          >
          <v-card>
            <v-card-title>
              <v-breadcrumbs :items="levels_rel"></v-breadcrumbs>
            </v-card-title>
            <v-card-text>
                
              <v-list lines="one">
                <v-list-item
                    v-if="levels_rel.length > 1"
                    title=".."
                    @click="navigate()"
                    icon="mdi-arrow-up"
                  ></v-list-item>
                  <v-list-item
                    v-for="item, i in folders"
                    :key="i"
                    :title="item.nombre"
                    @click="navigate(item)"
                  ></v-list-item>
                </v-list>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="showMove=false;">Cancelar</v-btn>
              <v-btn @click="mv()">Mover</v-btn>

            </v-card-actions>
          </v-card>
        </v-dialog>
    </v-main>
  </v-app>

 
</template>

<script>
import { wbStore } from "./stores/"
import { computed } from 'vue';
export default {
    setup(){
      const store = wbStore();
      const items = computed(() => store.items);
      const folders = computed(() => store.folders);
      const token = computed(() => store.token);
      return {
         store, items, folders, token
      }
    },
   data(){
      return {
         user: "",
         password: "",
         showNewDialog: false,
         showRename: false,
         showRemove: false,
         showMove: false,
         folder_name: "",
         fSel:null,
         name_edit:"",
         seleccionados: [],
         levels: ["Directorio Raiz"],
         levels_rel: ["Directorio Raiz"],
         nameRules: [
            value => {
              if (value) return true
              return 'Name is requred.'
            },
      ],
      }
   },
   methods:{
    mv(f){
      if (f){
        this.showMove = true;
        if (!f.selected) this.seleccionados.push(f.nombre);
        f.selected = true;
        this.store.get_list_dir(this.seleccionados);
      }else{
        this.store.mv(this.seleccionados);
        this.showMove = false;
        this.levels_rel = ["Directorio Raiz"];
        this.store.path_rel = null;
        this.seleccionados = [];
       
      }
    },
    rename(f){
      if (f){
        this.fSel = f;
        this.name_edit = f.nombre;
        this.showRename = true;
      }else{
        this.store.rename(this.fSel, this.name_edit);
        this.name_edit = "";
        this.showRename = false;
        this.fSel = null;
      }
    },
    remove(f){
      if (f){
        if (!f.selected) this.seleccionados.push(f.nombre);
        f.selected = true;
        this.showRemove = true;
      }else{
        this.showRemove = false;
        this.store.remove(this.seleccionados);
        this.seleccionados = [];
      }
    },
    navigate(f){
      if (f){
         this.store.path_rel = this.store.path_rel + "/"+f.nombre;
         this.levels_rel.push(f.nombre);
      }else{
          let ruta = this.store.path_rel.split("/")
          let aux = ""
          ruta.forEach((e,i) => {
            if (i>0 && i < ruta.length - 1){
               aux += "/"+ruta[i];
            }
          });
          this.store.path_rel = aux;
          if (this.levels_rel.length > 1) this.levels_rel.pop()     
      }
      this.store.get_list_dir(this.seleccionados[this.seleccionados.length-1]);
    },
    enter_folder(f){
      if (f){
         this.store.path = this.store.path + "/"+f.nombre;
         this.levels.push(f.nombre);
      }else{
          let ruta = this.store.path.split("/")
          let aux = ""
          ruta.forEach((e,i) => {
            if (i>0 && i < ruta.length - 1){
               aux += "/"+ruta[i];
            }
          });
          this.store.path = aux; 
          if (this.levels.length > 1) this.levels.pop()     
      }
      this.store.get_list();
    },
    selected(f){
      if (f.selected){
         this.seleccionados = this.seleccionados.filter(e => {
             return e != f.nombre
         })
      }else{
        this.seleccionados.push(f.nombre)
      }
    },
    newfolder(){
      this.store.newfolder(this.folder_name);
      this.showNewDialog = false;
      this.folder_name = ''
    }
   },
   watch:{
      items(v){
        this.seleccionados = [];
      },
      token(v){
        if (this.token) this.store.get_list();
      }
   },
   mounted(){
    this.store.set_token();
    if (this.token) this.store.get_list();
   },
   
   
}


</script>
