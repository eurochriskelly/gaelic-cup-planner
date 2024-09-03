

function CompetitionsTabView() {
  return (
    <TabView>
      <TabPanel header="By Competition">
        <ByCompetition />
      </TabPanel>
      <TabPanel header="By Pitch">
        <ByPitch />
      </TabPanel>
    </TabView>
  );
}

function ByCompetition() {
  const [selectedCompetition, setSelectedCompetition] = useState('Mens');
  const [competitions, setCompetitions] = useState([
    { name: "Mens", code: "Mens" },
    { name:"Womens", code: "Womens" },
    { name:"Youth", code: "Youth"},
  ]);
  return (
    <>
      <Dropdown 
        value={selectedCompetition} 
        mode="basic"
        onChange={(e) => setSelectedCity(e.value)}
        options={competitions}
        optionLabel="name" 
        placeholder="Select a competition" 
        className="w-full md:w-14rem" />
      <BigView />
    </>
  );
}

function ByPitch () {
  return (
    <>
      <div>ok</div>
    </>
  );
}

export default CompetitionsTabView;
