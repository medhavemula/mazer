async function loadDashboard() {
  const res = await fetch('./data/students.json');
  const data = await res.json();
  renderCards(data.summary);
  renderTable(data.students);
  renderChart(data.monthly_scores);
}

function renderCards(s) {
  document.getElementById('stat-total').textContent = s.total_students;
  document.getElementById('stat-score').textContent = s.average_score;
  document.getElementById('stat-top').textContent = s.top_performers;
  document.getElementById('stat-attend').textContent = s.attendance_rate;
}

function renderTable(students) {
  const tbody = document.getElementById('student-tbody');
  const colors = { 'Excellent':'success', 'Good':'primary', 'Average':'warning', 'Needs Improvement':'danger' };
  tbody.innerHTML = students.map(s => `
    <tr>
      <td>${s.id}</td>
      <td><b>${s.name}</b></td>
      <td>${s.subject}</td>
      <td>
        <div class="d-flex align-items-center gap-2">
          <div class="progress flex-grow-1" style="height:6px">
            <div class="progress-bar bg-${s.score>=80?'success':s.score>=60?'warning':'danger'}"
                 style="width:${s.score}%"></div>
          </div>
          <span>${s.score}</span>
        </div>
      </td>
      <td>${s.attendance}</td>
      <td><span class="badge bg-light-${colors[s.status]} text-${colors[s.status]}">${s.status}</span></td>
    </tr>`).join('');
}

function renderChart(chartData) {
  const options = {
    series: [{ name: 'Avg Score', data: chartData.data }],
    chart: { type: 'line', height: 300, toolbar: { show: false } },
    stroke: { curve: 'smooth', width: 3 },
    colors: ['#435ebe'],
    xaxis: { categories: chartData.labels },
    yaxis: { min: 50, max: 100 }
  };
  new ApexCharts(document.querySelector('#scoreChart'), options).render();
}

document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
  document.getElementById('searchInput').addEventListener('input', function() {
    const q = this.value.toLowerCase();
    document.querySelectorAll('#student-tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
});