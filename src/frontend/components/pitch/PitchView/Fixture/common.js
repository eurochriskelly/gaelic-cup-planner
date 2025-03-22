
export function extractUppercaseAndNumbers(name) {
    return name.match(/[A-Z0-9]/g)?.join('') || '';
}
