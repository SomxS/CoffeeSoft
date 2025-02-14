class GestorActividades extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    initComponents() {
        this.filterBar();
    }

    cancelTask(id) {
        this.swalQuestion({
            opts: { title: `¿Esta seguro de cancelar la tarea?` },
            data: { opc: "cancelTask", id: id }, // data para el backend.
            methods: {
                request: (data) => {
                    if (data.success === true) {
                        alert({ text: "Se ha cancelado la tarea", timer: 1500 });
                        this.ls();
                    }
                },
            },
        });
    }

    modalRecorder() {
        bootbox.dialog({
            title: "",
            message: '<div id="containerHistory"></div>',
            closeButton: true,
        });
    }

    async getListEmployed() {
        let data = await useFetch({
            url: this._link,
            data: { opc: "getListEmployed", udn: $("#id_udn").val() },
        });

        $("#id_employed").option_select({ data: data.employeds });
    }

    modalNewTask() {
        this.modalFormTask({
            bootbox: { title: "NUEVA ACTIVIDAD", id: "modalNewActivity", size: "large" },
            data: { opc: "addTask" },
            success: (data) => {
                if (data.success === true) {
                    alert({ text: "Se ha creado una nueva tarea", timer: 1500 });
                    this.ls();
                }
            },
        });
        this.getListEmployed();
    }
    
    async modalEditTask(id) {
        // get data.
        let data = await useFetch({ url: this._link, data: { opc: "getTask", id: id } });
        // create component.
        this.modalFormTask({
            id: "containerModalEdit",
            bootbox: { title: "Editar Evento ", id: "modalNuevoEvento", size: "large" },
            data: { opc: "editTask", idActivity: id },
            autofill: data,
            success: (data) => {
                if (data.success === true) {
                    alert({ text: "Se ha actualizado la tarea.", timer: 1500 });
                    this.ls();
                }
            },
        });

        $("#id_udn").val(data.id_udn).trigger("change");

        // // ESTO SE TIENE QUE CORREGIR, !! OJO, el autofill funciona unicamente con componentes html.
        setTimeout(() => {
            $("#id_employed").val(data.id_employed);
        }, 400);
    }
}
