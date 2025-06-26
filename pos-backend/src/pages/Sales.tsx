const getEstadoColor = (estado: string): 'error' | 'success' | 'info' | 'warning' => {
    switch (estado.toLowerCase()) {
        case 'completada':
            return 'success';
        case 'pendiente':
            return 'warning';
        case 'cancelada':
            return 'error';
        default:
            return 'info';
    }
}; 