
const foo = 1;


function createTournamentRow({ id, title, date, location, eventUuid, isLoggedIn }) {
  return `
    <tr>
      <td style="padding: 8px">${id || 'N/A'}</td>
      <td style="padding: 8px">${title || 'N/A'}</td>
      <td style="padding: 8px" class="text-nowrap">${date ? date.substring(0, 10) : 'N/A'}</td>
      <td style="padding: 8px">${location || 'N/A'}</td>
      ${isLoggedIn ? `
        <td style="padding: 8px"><button style="padding: 8px 16px; border-radius: 4px; color: white; background-color: #f97316" hx-get="/planning/${id}/matches" hx-target="body" hx-swap="outerHTML">Planning</button></td>
        <td style="padding: 8px"><button style="padding: 8px 16px; border-radius: 4px; color: white; background-color: #16a34a" hx-get="/execution/${id}/recent" hx-target="body" hx-swap="outerHTML">Execution</button></td>
        <td style="padding: 8px"><button style="padding: 8px 16px; border-radius: 4px; color: white; background-color: #14b8a6" onclick="window.copyEventLink ? window.copyEventLink('${eventUuid || 'N/A'}') : alert('Copy function not available')">Copy Link</button></td>
      ` : ''}
    </tr>
  `;
}

module.exports = {
  createTournamentRow
}
