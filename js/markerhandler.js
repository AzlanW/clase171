var uid = null;
AFRAME.registerComponent("markerhandler", {
  init: async function() {
    var toys = await this.getToys();

    if (uid == null) {
      this.askUserId()
    }

    this.el.addEventListener("markerFound", () => {
      if (uid !== null) {
        var markerId = this.el.id;
        this.handleMarkerFound(toys, markerId);
      }
    });

    this.el.addEventListener("markerLost", () => {
      this.handleMarkerLost();
    });
  },
  askUserId: function() {
    var iconUrl = "https://raw.githubusercontent.com/whitehatjr/ar-toy-store-assets/master/toy-shop.png";
    swal({
      title: "bienvenido a la tienda de juguetes",
      icon: iconUrl,
      content: {
        element: "input",
        attributes:{
          placeholder: "escribe tu id de usuario"
        }
      }
    }).then(inputValue => {
      uid = inputValue;
    })
  },
  handleMarkerFound: function(toys, markerId) {
    var toy = toys.filter(toy => toy.id == markerId)[0];

    if (toy.is_out_of_stock) {
      swal({
        icon: "warning",
        title: toy.toy_name.toUpperCase(),
        text: "este juguete no está disponible",
        timer:2500,
        buttons: false
      })
    }
    // Cambia la visibilidad del botón div
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "flex";

    var orderButtton = document.getElementById("order-button");
    var orderSummaryButtton = document.getElementById("order-summary-button");

    // Usa los eventos de clic
    orderButtton.addEventListener("click", () => {
      swal({
        icon: "https://i.imgur.com/4NZ6uLY.jpg",
        title: "¡Gracias por tu orden!",
        text: "  ",
        timer: 2000,
        buttons: false
      });
    });

    orderSummaryButtton.addEventListener("click", () => {
      swal({
        icon: "warning",
        title: "Resumen de la orden",
        text: "Operación en curso"
      });
    });

    // Cambia el tamaño del modelo a su escala inicial
    var toy = toys.filter(toy => toy.id === markerId)[0];

    var model = document.querySelector(`#model-${toy.id}`);
    model.setAttribute("position", toy.model_geometry.position);
    model.setAttribute("rotation", toy.model_geometry.rotation);
    model.setAttribute("scale", toy.model_geometry.scale);
  },
  getToys: async function() {
    return await firebase
      .firestore()
      .collection("toys")
      .get()
      .then(snap => {
        return snap.docs.map(doc => doc.data());
      });
  },
  handleMarkerLost: function() {
    // Cambia la visibilidad del botón div
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "none";
  }
});
