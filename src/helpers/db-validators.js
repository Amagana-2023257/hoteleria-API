import User from "../user/user.model.js"
import Hotel from "../hotel/hotel.model.js"
import Room from "../room/room.model.js"
import Event from "../event/event.model.js";

export const emailExists = async (email = "") => {
    const existe = await User.findOne({ email })
    if (existe) {
        throw new Error(`The email ${email} is already registered`)
    }
}

export const usernameExists = async (username = "") => {
    const existe = await User.findOne({ username })
    if (existe) {
        throw new Error(`The username ${username} is already registered`)
    }
}

export const userExists = async (uid = " ") => {
    const existe = await User.findById(uid)
    if (!existe) {
        throw new Error("No existe el usuario con el ID proporcionado")
    }
}

export const hotelExists = async (id = " ") => {
    const existe = await Hotel.findById(id)
    if (!existe) {
        throw new Error("No existe el hotel con el ID proporcionado")
    }
}

export const nameHotelExists = async (name = " ") => {
    const existe = await Hotel.findOne({ name })  
    if (existe) {
        throw new Error(`The hotel ${name} is already registered`)
    }
}

export const roomExists = async (id = " ") => {
    const existe = await Room.findById(id)
    if (!existe) {
        throw new Error("The room with the provided ID does not exist")
    }
}

export const eventExists = async (id = "") => {
    const existe = await Event.findById(id);
    if (!existe) {
        throw new Error("No existe el evento con el ID proporcionado")
    }
}

export const reservationExists = async (id) => {
    const exists = await Reservation.findById(id);
    if (!exists) {
      throw new Error(`No existe reservación con ID: ${id}`);
    }
  };
  
