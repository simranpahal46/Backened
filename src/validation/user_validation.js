export const Validname=(name)=>{
    const regex=/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
      return regex.test(name)
}

export const Validemail=(email)=>{
    const regex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email)
}

export const Validpassword=(password)=>{
    const regex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.password
}