// utils.ts

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const calculateAge = (birthDate: string) => {
  const birthDateObj = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDifference = today.getMonth() - birthDateObj.getMonth();

  // If the birthday hasn't happened yet this year, subtract one from age
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }

  return age;
};

export const getGeneration = (birthDate: string) => {
  const age = calculateAge(birthDate);

  // Mapping age to generation
  if (age >= 25) {
    return "Millennial (Gen Y)";
  } else if (age >= 10 && age < 25) {
    return "Gen Z";
  } else if (age >= 56 && age < 75) {
    return "Baby Boomer";
  } else if (age >= 76 && age < 96) {
    return "Silent Generation";
  } else {
    return "Gen Alpha";
  }
};
