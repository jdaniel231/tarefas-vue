<template>
  <div class="container mt-2">
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
      status: Status
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

      this.showToast("success", "Sucesso!", "Tarefa criado com suceso");
      this.tasks = await TasksModel.params({ status: this.statusList }).get();
    },

    isFinished(task) {
      return task.status === Status.FINISHED;
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
