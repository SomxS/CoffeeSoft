
<?php
require_once('../../conf/_Utileria.php');
require_once('../../conf/_CRUD.php');

class Gestordeactividades extends CRUD{
    protected $bd;
    protected $ch;
    protected $util;

    public function __construct() {
        $this->bd = "rfwsmqex_gvsl_calendarizacion2.";
        $this->ch = "rfwsmqex_gvsl_rrhh.";   
        $this->util = new Utileria(); 
    }


function lsUDN(){
    return $this->_Select([
        'table'  => 'udn',
        'values' => 'idUDN AS id, UDN AS valor',
        'where'  => 'Stado = 1',
        'order' => ['ASC'=>'Antiguedad']
    ]);
}
function lsPriority(){
    return $this->_Select([
        'table'     => "{$this->bd}ga_priority",
        'values'    => "idPriority AS id,priority AS valor,description",
    ]);
}
function lsEmployed($array){
    $innerjoin = [
        "rh_puesto_area" => "Puesto_Empleado = idPuesto_Area",
        "rh_puestos"     => "id_Puesto = idPuesto",
        "rh_area_udn"    => "Area_Empleado = idAreaUDN",
        "rh_area"        => "id_Area = idArea ",
    ];

    $where   = ["Estado = 1","UDN_Empleado"];
    $where[] = $array[0] == 8 ? "Nombre_Puesto LIKE '%jefe%'" : "Area LIKE '%gerencia%'";

    return $this->_Select([
        'table'     => "{$this->ch}empleados",
        'values'    => 'idEmpleado AS id,Nombres AS valor,Area AS area',
        'where'     => $where,
        'innerjoin' => $innerjoin,
        'order'     => ['ASC'=>'Nombres'],
        'data'      => $array
    ]);
}
function newTask($array){
    $array['table'] = "{$this->bd}ga_activities";
    return $this->_Insert($array);
}
function updateTask($array){
    $array['table'] = "{$this->bd}ga_activities";
    return $this->_Update($array);
}
function cancelTaskByID($array){
    return $this->_Update([
        'table'  => "{$this->bd}ga_activities",
        'values' => "id_status",
        'where'  => "idActivity",
        'data'   => $array
    ]);
}
function getTaskByID($array){
    return $this->_Select([
        'table'     => "{$this->bd}ga_activities",
        'values'    => "id_udn,id_employed,activities,id_priority",
        'where'     => "idActivity",
        'data'      => $array
    ])[0];
}
function listTask($array){
    $values = [
        "idActivity AS id",
        "Nombres",
        "name_status",
        "activities",
        "date_creation",
        "date_follow",
        "id_status",
        "UDN",
        "priority",
    ];

    $innerjoin = [
        "{$this->bd}event_status" => "id_status = idStatus",
        "{$this->ch}empleados"     => "id_employed = idEmpleado",
        "udn"                      => "id_udn = idUDN",
        "{$this->bd}ga_priority"   => "id_priority = idPriority",
    ];

    $where   = [];
    $where[] = "DATE_FORMAT(date_creation,'%Y-%m-%d') BETWEEN ? AND ?";
    $data    = [];
    $data[]  = $array['fi'];
    $data[]  = $array['ff'];

    if($array['udn'] != 0) {
        $where[] = "id_udn";
        $data[]  = $array['udn'];
    }
    if($array['estado'] != 0) {
        $where[] = "id_status";
        $data[]  = $array['estado'];
    }

    return $this->_Select([
        'table'     => "{$this->bd}ga_activities",
        'values'    => $values,
        'where'     => $where,
        'innerjoin' => $innerjoin,
        'data'      => $data
    ]);
}
function lsStatus(){
    $sql = $this->_Select([
        'table'  => "{$this->bd}event_status",
        'values' => 'idStatus AS id,UPPER(name_status) AS valor',
    ]);
    
    return array_merge([["id"=>0,"valor"=>"TODOS LOS ESTADOS"]],$sql);
}
}
?>