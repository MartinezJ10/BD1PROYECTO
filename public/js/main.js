//GENERAR DE FORMA ITERATIVA LOS ELEMENTOS DEL DEPARTAMENTOS CON BASE EN EL PAIS SELECCIONADO
document.addEventListener('DOMContentLoaded',obtenerDepartamentos);
document.addEventListener('DOMContentLoaded',obtenerMunicipios);
document.addEventListener('DOMContentLoaded',obtenerAldeas);
document.addEventListener('DOMContentLoaded',obtenerColonias);

function obtenerDepartamentos() {
    const selectPaises = document.getElementById('selectPais');
    const selectDepartamento = document.getElementById('selectDepartamento');

    selectPaises.addEventListener('change', function() {
        const seleccionPais = selectPaises.value;

        fetch(`/departamento?pais=${seleccionPais}`)
            .then(response => response.json())
            .then(departamento => {
                selectDepartamento.innerHTML = '';
                generarOpcionDefault(selectDepartamento)

                departamento.deptos.forEach(depto => {
                    const optionElement = document.createElement('option');
                    optionElement.textContent = depto.Nombre;
                    optionElement.value = depto.ID;
                    selectDepartamento.appendChild(optionElement);
                });
            })
            .catch(error => console.error('Error fetching departments:', error));
    });
}

function obtenerMunicipios() {
    const selectDepartamento = document.getElementById('selectDepartamento');
    const selectMunicipio = document.getElementById('selectMunicipio');

    selectDepartamento.addEventListener('change', function() {
        const seleccionDepartamento = selectDepartamento.value;

        fetch(`/municipio?departamento=${seleccionDepartamento}`)
            .then(response => response.json())
            .then(municipio => {
                selectMunicipio.innerHTML = '';
                generarOpcionDefault(selectMunicipio)

                municipio.municipios.forEach(municipio => {
                    const optionElement = document.createElement('option');
                    optionElement.textContent = municipio.Nombre;
                    optionElement.value = municipio.ID;
                    selectMunicipio.appendChild(optionElement);
                });
            })
            .catch(error => console.error('Error fetching municipios:', error));
    });
}

function obtenerAldeas() {
    const selectMunicipio = document.getElementById('selectMunicipio');
    const selectAldea = document.getElementById('selectAldea');

    selectMunicipio.addEventListener('change', function() {
        const seleccionMunicipio = selectMunicipio.value;

        fetch(`/aldea?municipio=${seleccionMunicipio}`)
            .then(response => response.json())
            .then(aldea => {
                selectAldea.innerHTML = '';
                generarOpcionDefault(selectAldea)

                aldea.aldeas.forEach(aldea => {
                    const optionElement = document.createElement('option');
                    optionElement.textContent = aldea.Nombre;
                    optionElement.value = aldea.ID;
                    selectAldea.appendChild(optionElement);
                });
            })
            .catch(error => console.error('Error fetching aldeas:', error));
    });
}

function obtenerColonias() {
    const selectAldea = document.getElementById('selectAldea');
    const selectColonia = document.getElementById('selectColonia');

    selectAldea.addEventListener('change', function() {
        const seleccionAldea = selectAldea.value;

        fetch(`/colonia?aldea=${seleccionAldea}`)
            .then(response => response.json())
            .then(colonia => {
                selectColonia.innerHTML = '';
                generarOpcionDefault(selectColonia)

                colonia.colonias.forEach(colonia => {
                    const optionElement = document.createElement('option');
                    optionElement.textContent = colonia.Nombre;
                    optionElement.value = colonia.ID;
                    selectColonia.appendChild(optionElement);
                });
            })
            .catch(error => console.error('Error fetching colonias:', error));
    });
}

function generarOpcionDefault(selectObject) {
    const optionElement = document.createElement('option');
    optionElement.textContent = "SELECCIONA UNA OPCION";
    optionElement.value = "0";
    selectObject.appendChild(optionElement);
}
