import { defineStore } from 'pinia'
import  axios  from 'axios'
const server = "http://127.0.0.1:8000"

export const wbStore = defineStore('wbStore',  {
   state: ()=>({
      items:[],
      error: null,
      ocupado: false,
      path: null
   }),
   actions: {
     async get_list(){
      try {
          this.$state.ocupado = true;
          this.$state.error = null;
          let params = new FormData()
          if (this.$state.path) params.append("path", this.$state.path)
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
          if (this.$state.path) params.append("path", this.$state.path)
          params.append("nombre", folder_name);
          const data = await axios.post(server+"/new_folder/", params);
          this.$state.ocupado = false;
          if (data.data.success){
              this.$state.items.push(data.data)
              this.$state.items = data.data
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

     }
   }
})
