
// init vars.
let app, sub;

let api = "https://huubie.com.mx/alpha/eventos/ctrl/ctrl-payment.php";


$(async () => {

    // instancias.
    app = new App(api, 'root');
    app.init();

});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "";
    }

    init() {
        this.render();
    }

    render(options) {


        // this.tabLayout({
        //     parent: "root",
        //     id: "tabComponent",
        //     json: [
        //         { id: "recorder", tab: "EnviarRegistros", icon: "", active: true, onClick: () => { } },
        //         { id: "concentrado", tab: "Graficos", icon: "", onClick: () => { } },
        //     ]
        // });

        this.historyPay(123);

    }

    async historyPay(id) {

        let data = await useFetch({ url: this._link, data: { opc: 'getHistory', id: id } });

         bootbox.dialog({
            title: ``,
            size: "large",
            id: 'modalAdvance',
            closeButton: true,
            message: `<div id="containerChat"></div>`,
        });

        this.tabLayout({
          parent: "containerChat",
          id: "tabComponent",
          theme: "dark",
          json: [
            {
              id: "recorder",
              tab: "Bitácora de pagos",
              icon: "",
              onClick: () => {},
            },
            {
              id: "payment",
              tab: "Lista de pagos",
              active: true,
              onClick: () => {},
            },
          ],
        });

        $('#container-payment').html(`
            <div id="container-info-payment"></div>
            <div id="container-list-payment"></div>
        `);


        this.createTimeLine2({
            parent: 'container-recorder',
            data: data.history,
            success: () => {
                this.addHistory(id);
            }
        });

        this.renderResumenPagos(id);
        this.lsPay(id);



    }

    renderResumenPagos(totales) {
        const totalPagado = totales?.pagado ?? 0;
        const totalEvento = totales?.total ?? 0;
        const restante = totalEvento - totalPagado;

        $('#container-info-payment').prepend(`
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

            <div class="bg-blue-100 p-4 rounded-lg text-center ">
                <p class="text-sm text-blue-700">Total Pagado</p>
                <p class="text-2xl font-bold text-blue-900" id="totalPagado">$${totalPagado.toFixed(2)}</p>
            </div>

            <div class="bg-green-100 p-4 rounded-lg text-center ">
                <p class="text-sm text-green-700">Total del Evento</p>
                <p class="text-2xl font-bold text-green-900" id="totalEvento">$${totalEvento.toFixed(2)}</p>
            </div>

            <div class="bg-red-100 p-4 rounded-lg text-center ">
                <p class="text-sm text-red-700">Restante</p>
                <p class="text-2xl font-bold text-red-900" id="totalRestante">$${restante.toFixed(2)}</p>
            </div>

        </div>
    `);
    }

    lsPay(id) {

        this.createTable({
            parent     : "container-list-payment",
            idFilterBar: "filterBarEventos",
            data       : { opc: 'listPagos', id: id },
            conf       : { datatable: false, pag: 15 },
            coffeesoft: true,
            attr: {
                id: "tablaEventos",
                theme: 'light',
                center: [1, 2, 3, 6, 7],
                extends: true,
            },


        });

    }

    createTimeLine2(options) {
        let defaults = {
            parent: "",
            id: "historial",
            data: [],
            success: () => { console.log('addLine') },
            input_id: "iptHistorial",
            class: "p-3 bg-gray-900 text-white rounded-lg h-80 overflow-y-auto",
            user_photo: "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png",
            icons: {
                payment: "💵",
                comment: "💬",
                event: "📅",
                default: "🔹"
            }
        };

        let opts = Object.assign(defaults, options);

        $('#' + opts.parent).empty();

        let historialContainer = $('<div>', { class: opts.class + " flex flex-col h-full", id: opts.id });

        // 📜 **Contenedor de línea de tiempo**
        let timeline = $('<div>', { class: "relative flex flex-col gap-4 flex-grow overflow-y-auto p-3" });

        // 📜 **Generar los elementos del historial**
        opts.data.forEach((item, index) => {
            let entry = $('<div>', { class: "flex items-start gap-3 relative" });

            // 🔵 **Seleccionar el icono basado en el `type`**
            let iconType = opts.icons[item.type] || opts.icons.default;

            // 🔵 **Columna de iconos y líneas**
            let iconContainer = $('<div>', { class: "flex flex-col items-center relative" }).append(
                // Icono del evento
                $('<div>', {
                    class: "w-8 h-8 flex items-center justify-center bg-gray-700 text-white rounded-full",
                    html: iconType
                }),
                // 📏 Línea de tiempo (solo si no es el último elemento)
                index !== opts.data.length - 1
                    ? $('<div>', { class: "w-[2px] min-h-[28px] bg-gray-600 flex-1 mt-2" })
                    : ""
            );

            // 📝 **Fila con título y fecha alineados**
            let titleRow = $('<div>', { class: "flex justify-between items-center w-full" }).append(
                $('<span>', { class: "font-semibold text-gray-200", text: item.valor }), // Título
                $('<small>', { class: "text-gray-400 text-xs", text: item.date }) // Fecha
            );

            // 💬 **Mensaje o descripción del evento**
            let details = $('<div>', { class: "text-sm bg-gray-800 p-2 rounded-md shadow-md w-full" }).append(titleRow);

            if (item.message) {
                let messageBox = $('<div>', { class: " text-gray-300 text-xs p-2 rounded-md mt-1", text: item.message });
                details.append(messageBox);
            }

            entry.append(iconContainer, details);
            timeline.append(entry);
        });

        historialContainer.append(timeline);

        // 📝 **Barra de entrada de mensaje (oscura)**
        let messageBar = $('<div>', { class: "bg-gray-800 rounded-lg flex items-center p-2 border-t border-gray-700 mt-auto" }).append(
            $('<input>', {
                id: opts.input_id,
                class: "w-full px-3 py-2 border-none outline-none bg-gray-700 text-white placeholder-gray-400 text-sm",
                placeholder: "Escribe aquí..."
            }),
            $('<button>', {
                class: "bg-blue-700 hover:bg-blue-600 text-white p-2 rounded-sm ml-2 flex items-center justify-center transition",
                click: opts.success
            }).append(
                $('<i>', { class: "icon-direction-outline" }) // Icono de envío
            )
        );

        historialContainer.append(messageBar);

        // Renderizar el componente
        $('#' + opts.parent).empty().append(historialContainer);
    }







    async viewTable(options) {
        let data = await useFetch({
            url: this._link,
            data: { opc: 'lsVentas', fi: '2025-05-01', ff: '2025-05-31', status: 0 }
        });

        // this.createCoffeTable({
        //     parent: 'container-recorder',
        //     data: data,
        //     theme: 'corporativo',
        //     extends: true
        // });
        this.ls();

    }



    ls() {

        this.createTable({
            parent: "container-recorder",
            idFilterBar: "filterBarEventos",
            data: { opc: 'list', id:11},
            conf: { datatable: false, pag: 15 },
            coffeesoft: true,
            attr: {
                id: "tablaEventos",
                theme:'light',
                title:'Tabulaciones',
                subtitle:'Listado de tabulaciones por unidad de negocio y temporada',
                striped:true,
                center: [1, 2, 3, 6, 7],
                extends: true,
            },
        });

    }


    // JSON
    jsonExample() {
        return {
            thead: ["Fecha", "Actividad", "Encargado", "Estado", ""],
            row: [
                {
                    id: 1,
                    Fecha: {
                        html: "08-abr-2025<br>18-abr-2025",
                        class: "bg-red-400 text-white text-center rounded-l px-2 py-1"
                    },
                    Actividad: "Enviar comprobantes",
                    Encargado: "Ana",
                    Estado: {
                        html: `<span class="flex w-32 justify-content-center text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    ⏳ EN PROCESO
                 </span>`,
                        class: "text-center"
                    },

                    dropdown: [
                        {
                            text: "Ver",
                            icon: "icon-eye",
                            onclick: "console.log('Ver ID 1')"
                        },
                        {
                            text: "Editar",
                            icon: "icon-pencil",
                            onclick: "console.log('Editar ID 1')"
                        }
                    ]
                },
                {
                    id: 1,
                    Fecha: {
                        html: "08-abr-2025<br>18-abr-2025",
                        class: "bg-red-400 text-white text-center rounded-l px-2 py-1"
                    },
                    Actividad: "colchas o waffles pagar la cotización que se envió en la requisición",
                    Encargado: "Hernesto",
                    Estado: {
                        html: `<span class="flex w-32 justify-content-center text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    ⏳ EN PROCESO
                 </span>`,
                        class: "text-center"
                    },

                    dropdown: [
                        {
                            text: "Ver",
                            icon: "icon-eye",
                            onclick: "console.log('Ver ID 1')"
                        },
                        {
                            text: "Editar",
                            icon: "icon-pencil",
                            onclick: "console.log('Editar ID 1')"
                        }
                    ]
                },
                {
                    id: 1,
                    Fecha: {
                        html: "08-abr-2025<br>18-abr-2025",
                        class: "bg-red-400 text-white text-center rounded-l px-2 py-1"
                    },
                    Actividad: "colchas o waffles pagar la cotización que se envió en la requisición",
                    Encargado: "Sofia",
                    Estado: {
                        html: `<span class="flex w-32 justify-content-center text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    ⏳ EN PROCESO
                 </span>`,
                        class: "text-center"
                    },

                    dropdown: [
                        {
                            text: "Ver",
                            icon: "icon-eye",
                            onclick: "console.log('Ver ID 1')"
                        },
                        {
                            text: "Editar",
                            icon: "icon-pencil",
                            onclick: "console.log('Editar ID 1')"
                        }
                    ]
                }
            ]
        }

    }
}



