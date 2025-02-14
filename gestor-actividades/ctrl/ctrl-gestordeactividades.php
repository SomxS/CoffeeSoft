<?php
if (empty($_POST['opc'])) exit(0);

setlocale(LC_TIME, 'es_ES.UTF-8');
date_default_timezone_set('America/Mexico_City');
// incluir tu modelo
require_once '../mdl/mdl-gestordeactividades.php';

// sustituir 'mdl' extends de acuerdo al nombre que tiene el modelo
$encode = [];
class ctrl extends Gestordeactividades{

    public function init(){
        $lsUDN = $this-> lsUDN();
        $udnZero = ["id" => "0", "valor" => "TODAS LAS UDN"];
        array_unshift($lsUDN, $udnZero);

        return[
            'udn'      => $lsUDN,
            'udnForm'  => $this->lsUDN(),
            'estados'  => $this->lsStatus(),
            'priority' => $this->lsPriority(),
        ];
    }

    public function getListEmployed(){
        return [ 'employeds' => $this -> lsEmployed([$_POST['udn']]) ];
    }
    public function addTask(){
        $_POST['date_creation'] = date('Y-m-d H:i:s');
        $_POST['date_follow']   = nextMonday();

        return ["success" => $this->newActivity($this->util->sql($_POST))];
    }
    public function getTask(){
        return $this->getTaskByID([$_POST['id']]);
    }
    public function editTask(){
        return ["success" => $this->updateTask($this->util->sql($_POST,1))];
    }
    public function cancelTask(){
        return ["success" => $this->cancelTaskByID([5,$_POST['id']])];
    }
    public function lsTasks(){

        # Declarar variables
        $__row = [];

        
        $ls = $this->listTask($_POST);
        foreach ($ls as $key) {
            $__row[] = [
                'id'              => $key['id'],
                'prioridad'       => $key['priority'],
                'actividad'       => $key['activities'],
                'Encargado'       => $key['Nombres'],
                'udn/area'        => $key['UDN'],
                'Inicio'          => $key['date_creation'],
                'Seguimiento'     => $key['date_follow'],
                'Dias acomulados' => 0,
                'estado'          => getEstatus($key['id_status']),
                'dropdown'        => lsDropdown($key['id'])
            ];
        }
    
        # encapsular datos
        return [
            "row"   => $__row,
        ];

    }

}
// Complementos
function lsDropdown($id) {
    $options = [
        ['Editar', 'icon-pencil', 'modalEditTask', 'success'],
        ['Agregar avance', 'icon-block-1', 'addAvance', 'danger'],
        ['En proceso', 'icon-money', 'inProccess', 'danger'],
        ['Finalizado', 'icon-history', 'Close', 'danger'],
        ['Cancelado', 'icon-history', 'cancelTask', 'danger'],
        ['Recordatorio', 'icon-history', 'modalRecorder', 'danger'],
    ];

    return array_map(function ($option) use ($id) {
        return [
            'text'    => $option[0],
            'icon'    => $option[1],
            'onclick' => "gestor.{$option[2]}($id)",
            'color'   => $option[3],
        ];
    }, $options);
}
function nextMonday(){
    $date = new DateTime();
    $date->modify('next monday');
    return $date->format('Y-m-d 09:00:00');
}
function getEstatus($idEstado){
    switch ($idEstado) {
        case '1': return '⌚ POR INICIAR';
        case '2': return '⏳  EN PROCESO';
        case '3': return '⏸️ PAUSADO';
        case '4': return '✅ FINALIZADO';
        case '5': return '🚫 CANCELADO';
    }
}
// Instancia del objeto

$obj = new ctrl();
$fn = $_POST['opc'];
$encode = $obj->$fn();

echo json_encode($encode);
