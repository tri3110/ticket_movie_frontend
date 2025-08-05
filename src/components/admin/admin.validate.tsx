
export function validateScreen(data: ScreenType) {
  const errors = {
    "message": "",
    "column": ""
  }

  if (!data.name || data.name.trim() === "") {
    errors["message"] = "Name isn't emty";
    errors["column"] = "name";
  }

  if (!["2D", "3D", "IMAX", "4DX"].includes(data.type)) {
    errors["message"] = "Loại rạp không hợp lệ";
    errors["column"] = "type";
  }

  if (!data.capacity || data.capacity < 1) {
    errors["message"] = "Sức chứa phải lớn hơn 0";
    errors["column"] = "capacity";
  }

  if (!data.cinema || !data.cinema.id) {
    errors["message"] = "Vui lòng chọn rạp chiếu";
    errors["column"] = "cinema";
  }

  return errors;
}