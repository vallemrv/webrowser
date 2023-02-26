
<template>
 <v-app>
    <v-app-bar title="Web Browser">
      <v-spacer></v-spacer>
      <v-btn @click="showNewDialog = true"> <v-icon>mdi-folder-plus</v-icon></v-btn>
    </v-app-bar>
    <v-main>
        <v-row class="pa-5 mt-2">
          <v-col cols="12" v-for="f, i in items" :key="i" >
            <v-card elevation="3">
                <v-card-text >
                    <v-row >
                      <v-col cols="1" class="mt-4 text-center">
                          <v-icon size="x-large" v-if="f.tipo != 'dir'">mdi-file-account-outline</v-icon>
                          <v-icon size="x-large" v-else>mdi-folder</v-icon>
                        </v-col>
                       <v-col cols="11" class="text-right"> <v-checkbox @click="selected(f)"  v-model="f.selected" :label="f.nombre" hide-details></v-checkbox></v-col>
                     </v-row>
                </v-card-text>
            </v-card>
          </v-col>
        </v-row>




    </v-main>
  </v-app>
  <v-dialog
      v-model="showNewDialog"
    >
    <v-card>
      <v-card-text>
          <v-form>
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
              <v-btn @click="newfolder()">Aceptar</v-btn>
            </v-container>
        </v-form>
      </v-card-text>
      
    </v-card>
  </v-dialog>
</template>

<script>
import { wbStore } from "./stores/"
import { computed } from 'vue';
export default {
    setup(){
      const store = wbStore();
      const items = computed(() => store.items);
      return {
         store, items
      }
    },
   data(){
      return {
         showNewDialog: false,
         folder_name: "",
         seleccionados: [],
         nameRules: [
            value => {
              if (value) return true

              return 'Name is requred.'
            },
      ],
      }
   },
   methods:{
    selected(f){
      if (f.selected){
         this.seleccionados = this.seleccionados.filter(e => {
             return e.nombre != f.nombre
         })
      }else{
        this.seleccionados.push(f)
      }
      console.log(this.seleccionados)
    },
      newfolder(){
        this.store.newfolder(this.folder_name);
        this.showNewDialog = false;
        this.folder_name = ''
      }
   },
   mounted(){
     this.store.get_list();
   },
   
   
}


</script>
