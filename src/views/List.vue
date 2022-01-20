<template>
  <div class="container mt-2">

    <b-form inline class="mb-2" >
      <b-form-input
        v-model="filter.subject"
        id="subject"
        placeholder="Ex.: Lavar o carro"
        class="mr-2"
        autocomplete="off"
      ></b-form-input>

      <b-form-select
        v-model="filter.status"
        :options="optionsStatus"
        class="mr-2"
      ></b-form-select>

      <b-button variant="outline-secondary"  @click="filterTasks" class="mr-2">Buscar</b-button>
      <b-button variant="outline-secondary"  @click="clearFilter" class="mr-2">Limpar filtro</b-button>

    </b-form>

    <template v-if="isTasksEmpety">
      <div class="empty-data mt-2 ">
        <img src="../assets/images/empty-data.svg"  class="empty-data-image">
        <b-button
          variant="outline-primary"
          class="mt-2"
          size="lg"
          to="/form"
        > Criar tarefa </b-button>
      </div>
    </template>
    <template v-else>
      <div v-for="(task) in tasks" :key="task.id" >
      <b-card :title="task.subject" class="mb-2" :class="{ 'finished-task': isFinished(task) }" >
        <b-card-text> {{task.description}} </b-card-text>

        <b-button variant="outline-secondary" class="mr-2" @click="updateStatus(task.id, status.FINISHED)">Concluir</b-button>
        <b-button variant="outline-secondary" class="mr-2" @click="updateStatus(task.id, status.ARCHIVED)">Arquivar</b-button>

        <b-button variant="outline-secondary" class="mr-2" @click="edit(task.id)">Editar</b-button>
        <b-button variant="outline-danger" class="mr-2" @click="remove(task.id)" >Excluir</b-button>

      </b-card>
      </div>
    </template>

    <b-modal ref="modalRemove" hide-footer title="Exclusao de tarefa" >
      <div class="d-block text-center ">
        Deseja realmente excluir essa tarefa {{taskSelected.subject}}
      </div>
      <div class="mt-3 d-flex justify-content-end" >
         <b-button variant="outline-secondary" class="mr-2" @click="hideModal">Cancelar</b-button>
        <b-button variant="outline-danger" class="mr-2" @click="confirmRemoveTask(task, index)" >Excluir</b-button>
      </div>
    </b-modal>

  </div>
</template>

<script>
import TasksModel from '@/models/TasksModel';
import Status from "@/valueObjects/status.js";

export default {
  name: "List",

  data() {
    return {
      tasks: [],
      taskSelected: [],
      statusList: [Status.OPEN, Status.FINISHED],
      status: Status,
      filter:{
        subject: null,
        status: null
      },
      optionsStatus: [
         { value: null, text: "Selecione status" },
        { value: Status.OPEN, text: "Aberto" },
        { value: Status.FINISHED, text: "Finalizado" },
        { value: Status.ARCHIVED, text: "Arquivado" },
      ]
    }
  },
  async created(){
    this.tasks = await TasksModel.params({ status: this.statusList }).get();
  },
   methods: {
    edit(taskId) {
      this.$router.push({ name: "form", params: { taskId } });
    },
    async remove(taskId) {
      this.taskSelected = await TasksModel.find(taskId)
      this.$refs.modalRemove.show();
    },

    hideModal() {
       this.$refs.modalRemove.hide();
    },

    async confirmRemoveTask() {
      this.taskSelected.delete();
      this.tasks = await TasksModel.params({ status: this.statusList }).get();
      this.hideModal();
    },

    async updateStatus(taskId, status) {
      let task = await TasksModel.find(taskId);
      task.status = status
      await task.save()

      this.tasks = await TasksModel.params({ 
        status:[
          this.status.OPEN,
          this.status.FINISHED
        ]
      }).get();
      this.showToast("success", "Sucesso!", "Tarefa atualizada com suceso");
    },

    isFinished(task) {
      return task.status === Status.FINISHED;
    },

    async filterTasks(){
      let filter = { ... this.filter };
      filter = this.clean(filter);
      this.tasks = await TasksModel.params(filter).get();
    },

   async filterTasks() {
    let filter = { ... this.filter };
    filter = this.clean(filter);
    this.tasks = await TasksModel.params(filter).get();
  },
 
  clean(obj) {
    for(var propName in obj) {
      if(obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj;
  },

  async clearFilter() {
    this.filter = {
      subject: null,
      status: null
    };

    this.tasks = await TasksModel.params({
      status: [
        this.status.OPEN,
        this.status.FINISHED,
      ]
    }).get();
  }
    
  },

  computed: {
    isTasksEmpety(){
      return this.tasks.length === 0;
    },
    
  }
}
</script>

<style scoped>
  .empty-data {
    display:flex;
    align-items:center;
    justify-content: center;
    flex-direction: column;
  }

  .empty-data-image{
    width: 300px;
    height: 300px;
  }

  
  .finished-task {
    opacity: 0.7
  }
  .finished-task > .card-body > h4, .finished-task > .card-body > p {
    text-decoration: line-through;
  }
</style>
