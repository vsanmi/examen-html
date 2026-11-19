document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formulario");
    const salidaPresupuesto = document.getElementById("presupuesto");
    const mensajeEnvio = document.getElementById("mensaje-envio");

    // ---------- VALIDACIÓN ----------
    const validadores = {
        nombre: (valor) => {
            if (valor === "") return "El nombre es obligatorio.";
            if (!/^\p{L}+$/u.test(valor)) return "El nombre solo puede contener letras.";
            if (valor.length < 3) return "El nombre debe tener al menos 3 caracteres.";
            if (valor.length > 15) return "El nombre no puede tener más de 15 caracteres.";
            return "";
        },
        apellidos: (valor) => {
            if (valor === "") return "Los apellidos son obligatorios.";
            // Se permiten espacios entre apellidos (p. ej. "Di Carlo Herranz")
            if (!/^\p{L}+(\s\p{L}+)*$/u.test(valor)) return "Los apellidos solo pueden contener letras.";
            if (valor.length < 4) return "Los apellidos deben tener al menos 4 caracteres.";
            if (valor.length > 40) return "Los apellidos no pueden tener más de 40 caracteres.";
            return "";
        },
        telefono: (valor) => {
            if (valor === "") return "El teléfono es obligatorio.";
            if (!/^\d+$/.test(valor)) return "El teléfono solo puede contener números.";
            if (valor.length !== 9) return "El teléfono debe tener exactamente 9 dígitos.";
            return "";
        },
        email: (valor) => {
            if (valor === "") return "El correo electrónico es obligatorio.";
            if (!/^[\w.-]+@[\w-]+(\.[\w-]+)*\.[A-Za-z]{2,}$/.test(valor)) {
                return "El formato no es válido. Ejemplo: nombre_apellido@dominio.com";
            }
            return "";
        },
        producto: (valor) => (valor === "" ? "Elige un producto." : ""),
        plazo: (valor) => {
            if (valor === "") return "Indica un plazo (número entero de meses).";
            const numero = Number(valor);
            if (!Number.isInteger(numero)) return "El plazo debe ser un número entero.";
            if (numero < 0) return "El plazo no puede ser negativo.";
            return "";
        }
    };

    function validarCampo(id) {
        const campo = document.getElementById(id);
        const mensaje = validadores[id](campo.value.trim());
        document.getElementById("error-" + id).textContent = mensaje;
        campo.setAttribute("aria-invalid", mensaje !== "");
        return mensaje === "";
    }

    function validarCondiciones() {
        const aceptadas = document.getElementById("condiciones").checked;
        document.getElementById("error-condiciones").textContent = aceptadas
            ? ""
            : "Debes aceptar las condiciones de privacidad.";
        return aceptadas;
    }

    // Se valida cada campo al salir de él y se corrige en directo al escribir
    Object.keys(validadores).forEach((id) => {
        const campo = document.getElementById(id);
        campo.addEventListener("blur", () => validarCampo(id));
        campo.addEventListener("input", () => {
            // Si ya mostraba error, se revalida mientras el usuario escribe
            if (document.getElementById("error-" + id).textContent !== "") validarCampo(id);
        });
    });

    document.getElementById("condiciones").addEventListener("change", validarCondiciones);

    // ---------- PRESUPUESTO ----------
    function calcularDescuento(meses) {
        if (meses >= 12) return 0.15;
        if (meses >= 6) return 0.10;
        if (meses >= 3) return 0.05;
        return 0;
    }

    function calcularPresupuesto() {
        const producto = document.getElementById("producto");
        const precioProducto = Number(producto.selectedOptions[0].dataset.precio) || 0;

        // Sin producto elegido el presupuesto es 0, aunque haya extras marcados
        if (producto.value === "") {
            salidaPresupuesto.textContent = "0 €";
            return;
        }

        let extras = 0;
        document.querySelectorAll('input[name="extras"]:checked').forEach((extra) => {
            extras += Number(extra.dataset.precio) || 0;
        });

        // Plazo no válido (vacío o negativo): se calcula sin descuento
        const plazo = Number(document.getElementById("plazo").value);
        const descuento = plazo >= 0 ? calcularDescuento(plazo) : 0;

        const total = Math.round((precioProducto + extras) * (1 - descuento));
        salidaPresupuesto.textContent = total + " €";
    }

    // Se recalcula con cualquier cambio de producto, plazo o extras
    document.getElementById("producto").addEventListener("change", calcularPresupuesto);
    document.getElementById("plazo").addEventListener("input", calcularPresupuesto);
    document.querySelectorAll('input[name="extras"]').forEach((extra) => {
        extra.addEventListener("change", calcularPresupuesto);
    });

    // ---------- ENVÍO Y REINICIO ----------
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault(); // no hay servidor: se comprueba y se muestra el resultado

        // Se validan TODOS los campos (sin cortar en el primero) para mostrar todos los errores
        const resultados = [
            ...Object.keys(validadores).map(validarCampo),
            validarCondiciones()
        ];

        if (resultados.includes(false)) {
            mensajeEnvio.textContent = "Revisa los campos marcados antes de enviar.";
            const primerError = formulario.querySelector('[aria-invalid="true"]');
            if (primerError) primerError.focus();
            return;
        }

        mensajeEnvio.textContent = "Formulario enviado correctamente. Presupuesto: " + salidaPresupuesto.textContent;
    });

    formulario.addEventListener("reset", () => {
        // El reset restaura los valores después de este evento, por eso el setTimeout
        setTimeout(() => {
            formulario.querySelectorAll(".error").forEach((error) => (error.textContent = ""));
            formulario.querySelectorAll("[aria-invalid]").forEach((campo) => campo.removeAttribute("aria-invalid"));
            mensajeEnvio.textContent = "";
            calcularPresupuesto();
        }, 0);
    });

    calcularPresupuesto(); // estado inicial: 0 €
});