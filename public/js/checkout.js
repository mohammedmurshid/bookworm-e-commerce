const { toSafeInteger } = require("lodash");

document.forms["checkoutForm"].addEventListener("submit", async (event) => {
  event.preventDefault();
  const paymentType = $(
    "input[name=paymentType]:checked",
    "#checkoutForm"
  ).val();
  data = new URLSearchParams(new FormData(event.target));
  if (paymentType == "cod") {
    checkout(data);
  } else {
    razorpay(orderId, amount);
  }
});

async function checkout(data) {
  try {
    const response = await axios({
      method: "post",
      url: "/user/checkout",
      data: data,
    });
    if (response.status == 201) {
      await Swal.fire({
        title: "Congrats!",
        text: "Order Successfull",
        icon: "success",
        confirmButtonColor: "#275237",
        width: "25em",
        timer: 3000,
      });
      window.location = "/user/myOrders";
    }
  } catch (err) {
    console.error(err);
    await Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
      confirmButtonColor: "#275237",
      width: "25em",
      timer: 3000,
    });
    window.location = "/user/checkout";
  }
}

function razorpay(orderId, amount) {
    let options = {
        "key": "rzp_test_RvSH12d82xA1Ab",
        "name": "BookWorm",
        "amount": amount,
        "orderId": orderId,
        "retry": false,
        "theme": {
            "colour": "#275237"
        },
        // This handler function will handle the success payment
        "handler": async function (response) {
            try {
                const verification = await axios({
                    method: "post",
                    url: `/user/payment/verify/${orderId}`,
                    data: {
                        response: response
                    }
                })
                if (verification.data.signatureValid) {
                    const paymentId = response.razorpay_payment_id

                    // appending order id and payment id to data to update on database
                    data.append("orderId", orderId)
                    data.append("paymentId", paymentId)

                    // calling checkout after payment verification
                    checkout(data)

                } else {
                    await Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Payment Failed!",
                        confirmButtonColor: "#275237",
                        width: "25em",
                        timer: 2000
                    })
                    window.location = "/user/checkout"
                }
            } catch (err) {
                console.log(err);
                window.location = "/user/myOrders"
            }
        }
    }
    const rzp1 = new razorpay(options)
    rzp1.open()
    rap1.on("payment.failed", async function (response) {
        await Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Payment Failed!',
            confirmButtonColor: '#275237',
            width: "25em",
            timer: 2000,
        })
        window.location = "/user/checkout"
    })
}

// DOM Manipulation for saved address filling
function fillForm(address, index) {
    let myAddress = JSON.parse(address)
    $("#addressInputField :input").prop("disabled", true)
    $("new-address").prop("disabled", false)
    $("new-address").prop("disabled", false)
    $("new-address").prop("disabled", false)

    $("#address-index").val(index)
    $("[name='firstName']").val(myAddress.firstName)
    $("[name='lastName']").val(myAddress.lastName)
    $("[name='address1']").val(myAddress.address1)
    $("[name='address2']").val(myAddress.address2)
    $("[name='city']").val(myAddress.city)
    $("[name='state']").val(myAddress.state)
    $("[name='zipcode']").val(myAddress.zipcode)
    $("[name='phone']").val(myAddress.phone)
}

function handleChange(checkbox) {
    if (checkbox.checked == true) {
        $("#addressInputField :input").not("[name=email]").prop("disabled", false)
        $("#addressInputField :input").not("[name=newAddress]").val('')
    }
}

async function removeAddress(index) {
    try {
        let result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#71ab86",
            cancelButtonColor: "#275237",
            confirmButtonText: "Yes, Delete it!",
            cancelButtonText: "No",
            width: "25em"
        })
        if (result.isConfirmed) {
            const response = await axios.delete(`/user/deleteAddress/${index}`)
            if (response.status == 204) {
                document.getElementById(`address-${index}`).remove()
                toastr.options = { "positionClass": "toast-bottom-right"}
                toastr.success("Address removed successfully")
            }
        }
    } catch (err) {
        console.error(err);
    }
}