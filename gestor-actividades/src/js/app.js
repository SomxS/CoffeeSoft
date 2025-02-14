let app, gestor;
let udn, udnForm, estados, priority, eventos;

const link = "ctrl/ctrl-gestordeactividades.php";

$(function () {
    fn_ajax({ opc: "init" }, link).then((data) => {
        udn = data.udn;
        udnForm = data.udnForm;
        estados = data.estados;
        priority = data.priority;

        app = new App(link, "");

        gestor = new GestorActividades(link, "");
        gestor.init();
    });
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }
    init() {
        this.render();
    }
    render() {
        this.layout();
        this.filterBar();
        this.ls();
    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: "Eventos",
        });
    }

    filterBar() {
        this.createfilterBar({
            parent: "filterBarEventos",
            data: [
                {
                    opc: "select",
                    class: "col-sm-3",
                    id: "udn",
                    lbl: "Seleccionar udn: ",
                    data: udn,
                    onchange: "app.ls()",
                },
                {
                    opc: "input-calendar",
                    class: "col-sm-3",
                    id: "calendar",
                    lbl: "Consultar fecha: ",
                },
                {
                    opc: "select",
                    class: "col-sm-3",
                    id: "estado",
                    lbl: "Seleccionar estados: ",
                    data: estados,
                    onchange: "app.ls()",
                },
                {
                    opc: "btn",
                    class: "col-sm-3",
                    color_btn: "primary",
                    id: "btnNuevaActividad",
                    text: "Nueva actividad",
                    fn: "gestor.modalNewTask()",
                },
            ],
        });
        // initialized.
        dataPicker({
            parent: "calendar",
            onSelect: (start, end) => {
                this.ls();
            },
        });
    }

    ls(options) {
        let rangePicker = getDataRangePicker("calendar");
        this.createTable({
            parent: "containerEventos",
            idFilterBar: "filterBarEventos",
            data: { opc: "lsTasks", fi: rangePicker.fi, ff: rangePicker.ff },
            conf: { datatable: false, pag: 3 },
            attr: {
                color_th: "bg-primary",
                id: "otroID",
                center: [1, 4, 5, 6, 7],
                right: [4],
                extends: true,
            },
            extends: false,
        });
    }

    modalFormTask(options) {
        let defaults = {
            id: "mdlActivity",
            bootbox: { title: "Activity", id: "modalNewTask", size: "large" },
            json: [
                { id: "id_udn", opc: "select", lbl: "UDN:", data: udnForm, value: 8, class: "col-12", required: true, onchange: "gestor.getListEmployed()" },
                { id: "id_employed", opc: "select", class: "col-12", lbl: "Responsable", required: true },
                { id: "activities", opc: "textarea", class: "col-12", lbl: "Actividades", rows: 5, required: true },
                { id: "id_priority", opc: "select", class: "col-12", data: priority, lbl: "Prioridad", required: true },
            ],

            validation: true,

            dynamicValues: {
                id_employed: "#id_employed",
            },

            success: (data) => {
                if (data.success === true) {
                    alert();
                    // this.ls();
                }
            },
        };

        let opts = this.ObjectMerge(defaults, options);

        this.createModalForm(opts);
    }
}
