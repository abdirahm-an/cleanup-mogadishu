// Simple toast implementation
export const toast = {
  success: (message: string) => {
    console.log("Success:", message)
    // In a real implementation, you'd show a toast notification
    alert(`Success: ${message}`)
  },
  error: (message: string) => {
    console.error("Error:", message)
    // In a real implementation, you'd show a toast notification
    alert(`Error: ${message}`)
  }
}