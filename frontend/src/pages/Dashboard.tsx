const Dashboard = () => {
    const currentDate = new Date();
const currentMonth = currentDate.getMonth(); // Returns a zero-based index

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

    const user = 'User'

    return (
        <>
            <div className="w-full h-full bg-base-100">
                <div className="flex flex-row justify-start items-center bg-white drop-shadow-sm w-full p-2">
                    <p>Hi <strong className=" text-secondary border-[1px] rounded-full px-2 p-1 border-secondary/20 mr-1">{user}</strong>, here is your plan for <strong className=" text-primary">{monthNames[currentMonth]}</strong></p>
                </div>
                <div className="flex flex-row justify-start items-start bg-white w-full h-full p-4">
                    <div className="flex flex-col justify-start items-center bg-white border-[1px] rounded-lg drop-shadow-dm border-primary/40 w-[50%]">
                        <p className="w-full p-1 uppercase text-black/70">{monthNames[currentMonth]}</p>

                        <div className="border-t-[1px] border-primary/50 w-full"></div>
                        <div className="flex flex-row justify-start items-center w-full p-1 bg-slate-50 rounded-lg">
                            <p className="uppercase text-primary text-xl basis-1/4">Week</p>
                            <p className="uppercase text-secondary text-xl basis-1/4">Plan</p>
                            <p className="uppercase text-secondary text-xl basis-2/4">Description</p>
                        </div>

                        <div className="border-t-[1px] border-slate-300 w-[90%] p-1"></div>
                        <div className="flex flex-row justify-start items-start w-full">
                            <div className="flex flex-col justify-start items-start basis-1/4 p-1">
                                <div className="basis-1/3 flex flex-row justify-center items-center border-[1px] border-primary/20 rounded-full w-5 h-5 text-center">1</div>
                                <div className="basis-1/3 flex flex-row justify-center items-center border-[1px] border-primary/20 rounded-full w-5 h-5 text-center">2</div>
                                <div className="basis-1/3 flex flex-row justify-center items-center border-[1px] border-primary/20 rounded-full w-5 h-5 text-center">3</div>
                            </div>

                            <div className="flex flex-col justify-start items-start basis-1/4">
                                <div className="dropdown basis-1/3">
                                    <div tabIndex={0} role="button" className=" whitespace-nowrap btn m-1">Chicken Week</div>
                                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                        <li><a>Chicken Week</a></li>
                                        <li><a>Beef Week</a></li>
                                        <li><a>Veggie Week</a></li>
                                        <li><a>+ Create Plan</a></li>
                                    </ul>
                                </div>
                                <div className="dropdown basis-1/3">
                                    <div tabIndex={0} role="button" className=" whitespace-nowrap btn m-1">Chicken Week</div>
                                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                        <li><a>Chicken Week</a></li>
                                        <li><a>Beef Week</a></li>
                                        <li><a>Veggie Week</a></li>
                                        <li><a>+ Create Plan</a></li>
                                    </ul>
                                </div>
                                <div className="dropdown basis-1/3">
                                    <div tabIndex={0} role="button" className=" whitespace-nowrap btn m-1">Chicken Week</div>
                                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                        <li><a>Chicken Week</a></li>
                                        <li><a>Beef Week</a></li>
                                        <li><a>Veggie Week</a></li>
                                        <li><a>+ Create Plan</a></li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex flex-col justify-start items-start basis-2/4 p-1">
                                <p className="basis-1/3 whitespace-nowrap">This week I'm eating chicken</p>
                                <p className="basis-1/3 whitespace-nowrap">This week I'm eating beef</p>
                                <p className="basis-1/3 whitespace-nowrap">This week I'm eating veggies</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </> 
    )
};

export default Dashboard;
