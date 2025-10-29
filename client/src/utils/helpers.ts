export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .normalize('NFD') // loại bỏ dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '') // bỏ ký tự đặc biệt
    .replace(/\s+/g, '-') // thay khoảng trắng bằng "-"
    .replace(/-+/g, '-') // gộp nhiều dấu "-"
}
