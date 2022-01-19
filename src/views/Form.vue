<template>
  <div class="container mt-2">
    <b-form>
      <b-form-group 
        label="Titulo" 
        label-for="subject" 
      >    
        <b-form-input
          id="subject"
          v-model.trim="$v.form.subject.$model"
          type="text"
          placeholder="Ex.: Lavar o carro"
          autocomplete="off"
          required
          :state="getValidation"
          aria-describedby="subject-feedback"
        ></b-form-input>
        <b-form-invalid-feedback 
         id="subject-feedback"
        >
          Campo obrigatorio.
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group 
        label="Descricao" 
        label-for="descriptiom" 
      >    
        <b-form-textarea
          id="description"
          v-model="form.description"
          type="text"
          placeholder="Ex.: Lavar o carro"
          autocomplete="off"
        ></b-form-textarea>
      </b-form-group>

      <b-button 
        type="button" 
        variant="outline-primary" 
        @click="saveTask"
        :disabled="!getValidation"
      >
        Salvar
      </b-button>

    </b-form>
  </div>
</template>

<script>

import ToastMixin from "@/mixins/toastMixin.js"
import { required, minLength } from "vuelidate/lib/validators";

export default {
  name: 'Form',

  mixins: [ToastMixin],

  data() {
    return {
      form: {
        subject:"",
        description: ""
      },
      methodSave: "new"
    }
  },

  created() {
    if(this.$route.params.index === 0 || this.$router.params.index !== undefined) {
      this.methodSave = "update";
      let tasks = JSON.parse(localStorage.getItem("tasks"));
      this.form = tasks[this.$route.params.index]
      
    }
  },

  methods: {
    saveTask() {
      if(this.methodSave === "update"){
        let tasks = JSON.parse(localStorage.getItem("tasks"));
        tasks[this.$route.params.index] = this.form;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        this.showToast("success", "Sucesso!", "Tarefa atualizada com suceso");
        this.$router.push({name: "list"});
        retunr;
      }

      let tasks = (localStorage.getItem("tasks")) ? JSON.parse(localStorage.getItem("tasks")) : [];
      tasks.push(this.form);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      this.showToast("success", "Sucesso!", "Tarefa criado com suceso");
      this.$router.push({name: "list"});
    }
  },

  validations: {
    form: {
      subject: {
        required,
        minLength: minLength(3)
      }
    }
  },

  computed: {
    getValidation() {
      if(this.$v.form.subject.$dirty === false) {
        return null;
      }

      return !this.$v.form.subject.$error;
    }
  }
}
</script>
