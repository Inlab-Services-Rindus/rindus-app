<?php
if(!count($_GET)) {
  $_POST['auth'] = [
    'server' => 'db',
    'username' => 'api',
    'password' => 'secret',
    'driver' => 'pgsql',
    'db'    => 'backend',
    'permanent' => '1'
  ];
}

include "./adminer-4.8.1.php";
?>