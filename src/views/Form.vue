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

      <b-form-group label="Data de vencimento" label-for="dateOverdue" >
        <b-form-datepicker
          id="dateOverdue"
          v-model="form.dateOverdue"
          label-no-date-selected="Selecione uma data"
          :min="getToday()"
        ></b-form-datepicker>
      </b-form-group> 

      <b-form-group
        label="Status"
        label-for="status"
      >
         <b-form-select v-model="form.status" :options="optionsStatus" ></b-form-select>
        
      </b-form-group>

      <b-button 
        type="button" 
        variant="outline-primary" 
        @click="saveTask"
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
import Status from "@/valueObjects/status.js";

export default {
  name: 'Form',

  mixins: [ToastMixin],

  data() {
    return {
      form: {
        subject:"",
        description: "",
        status: Status.OPEN,
        dateOverdue: ""
      },
      methodSave: "new",
      optionsStatus: [
        { value: Status.OPEN, text: "Aberto" },
        { value: Status.FINISHED, text: "Finalizado" },
        { value: Status.ARCHIVED, text: "Arquivado" },
      ]
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
      this.$v.$touch();
      if(this.$v.$error) return

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
    },

    getToday() {
      return new Date().toISOString().split('T')[0];
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
