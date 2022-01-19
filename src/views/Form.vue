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
import TasksModel from '@/models/TasksModel';

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

  async created() {
    if(this.$route.params.taskId) {
      this.methodSave = "update";
      this.form = await TasksModel.find(this.$route.params.taskId)
      
    }
  },

  methods: {
    saveTask() {
      if(this.methodSave === "update"){
        this.form.save();
        this.showToast("success", "Sucesso!", "Tarefa atualizada com suceso");
        this.$router.push({name: "list"});
        retunr;
      }

      const task =  new TasksModel(this.form);
      task.save();

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
