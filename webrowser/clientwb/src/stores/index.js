import { defineStore } from 'pinia'
import  axios  from 'axios'
const server = ""

export const wbStore = defineStore('wbStore',  {
   state: ()=>({
      items:[],
      error: null,
      ocupado: false,
      path: null,
      level: 0,
      path_rel: null,
      folders: [],
      token: null,
   }),
   actions: {
    set_token(){
      this.$state.token = JSON.parse(localStorage.getItem("token-wbrowser"));
    },
    async get_token(username, password){
      try {
          this.$state.ocupado = true;
          this.$state.error = null;
          let params = new FormData()
          params.append("username", username);
          params.append("password", password);
          const data = await axios.post(server+"/token/new.json", params);
          this.$state.ocupado = false;
          if (data.data.success){
            this.$state.token = data.data;
            localStorage.setItem("token-wbrowser", JSON.stringify(data.data));
          }else{
            this.$state.error = data.data.errors;
            console.log(data.data.errors)
          }
        }
        catch (error) {
          this.$state.ocupado = false;
          this.$state.error = error;
          console.log(error)
      }

    },
    async get_list(){
      try {
          this.$state.ocupado = true;
          this.$state.error = null;
          this.$state.items = [];
          let params = new FormData()
          params.append("user", this.$state.token.user);
          params.append("token", this.$state.token.token);
          if (this.$state.path) params.append("path", this.$state.path);
          const data = await axios.post(server+"/get_list/", params);
          this.$state.ocupado = false;
          if (data.data.success){
            this.$state.items = data.data.items;
            this.$state.path = data.data.path;
          }else{
            this.$state.error = data.data.errors;
            console.log(data.data.errors)
          }
          
        }
        catch (error) {
          this.$state.ocupado = false;
          this.$state.error = error;
          console.log(error)
      }

    },
    async newfolder(folder_name){
      try {
          this.$state.ocupado = true;
          this.$state.error = null;
          let params = new FormData();
          params.append("user", this.$state.token.user);
          params.append("token", this.$state.token.token);
          if (this.$state.path) params.append("path", this.$state.path)
          params.append("nombre", folder_name);
          const data = await axios.post(server+"/new_folder/", params);
          this.$state.ocupado = false;
          if (data.data.success){
              this.$state.items.push(data.data);
            }else{
              this.$state.error = data.data.errors;
              console.log(data.data.errors)
            }
          
        }
        catch (error) {
          this.$state.ocupado = false;
          this.$state.error = error;
          console.log(error)
      }

    },
    async rename(f, nombre){
      try {
          this.$state.ocupado = true;
          this.$state.error = null;
          let params = new FormData();
          params.append("user", this.$state.token.user);
          params.append("token", this.$state.token.token);
          params.append("old_name", this.$state.path+"/"+f.nombre);
          params.append("new_name", this.$state.path+"/"+nombre)
          const data = await axios.post(server+"/rename/", params);
          this.$state.ocupado = false;
          if (data.data.success){
               f.nombre = nombre;
            }else{
              this.$state.error = data.data.errors;
              console.log(data.data.errors)
            }
          
        }
        catch (error) {
          this.$state.ocupado = false;
          this.$state.error = error;
          console.log(error)
      }

    },
    async remove(list){
      try {
          this.$state.ocupado = true;
          this.$state.error = null;
          let params = new FormData();
          params.append("user", this.$state.token.user);
          params.append("token", this.$state.token.token);
          params.append("path", this.$state.path);
          params.append("files", JSON.stringify(list));
          const data = await axios.post(server+"/remove/", params);
          this.$state.ocupado = false;
          if (!data.data.success){
              this.$state.error = data.data.errors;
              console.log("Error: "+data.data.errors)
          }else{
              this.$state.items = this.$state.items.filter(e => {
                   return list.filter(o => { return e.nombre == o}).length == 0
              });
          }
          
        }
        catch (error) {
          this.$state.ocupado = false;
          this.$state.error = error;
          console.log("Error:"+ error)
      }

    },
    async mv(files){
      try {
          this.$state.ocupado = true;
          this.$state.error = null;
          let params = new FormData();
          params.append("user", this.$state.token.user);
          params.append("token", this.$state.token.token);
          params.append("src", this.$state.path);
          params.append("des", this.$state.path_rel);
          params.append("files", JSON.stringify(files));
          const data = await axios.post(server+"/mv/", params);
          this.$state.ocupado = false;
          if (!data.data.success){
              this.$state.error = data.data.errors;
              console.log("holaaaa"+data.data.errors)
          }else{
            this.$state.items = this.$state.items.filter(e => {
                  return files.filter(o => {  return e.nombre == o; }).length == 0
            });
          }
        }
        catch (error) {
          this.$state.ocupado = false;
          this.$state.error = error;
          console.log(error)
      }

    },
    async get_list_dir(nombres){
      try {
          this.$state.ocupado = true;
          this.$state.error = null;
          let params = new FormData();
          params.append("user", this.$state.token.user);
          params.append("token", this.$state.token.token);
          params.append("nombres", JSON.stringify(nombres));
          if (this.$state.path_rel) params.append("path", this.$state.path_rel)
          const data = await axios.post(server+"/get_list_dir/", params);
          this.$state.ocupado = false;
          if (data.data.success){
            this.$state.folders = data.data.items;
            this.$state.path_rel = data.data.path;
          }else{
            this.$state.error = data.data.errors;
            console.log(data.data.errors)
          }
          
        }
        catch (error) {
          this.$state.ocupado = false;
          this.$state.error = error;
          console.log(error)
      }

    },
   }
})
