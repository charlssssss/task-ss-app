// component for inputs
export const RegularInput = ({ name, title, value, change, m }) => {
    return (
        <div className={`flex flex-col my-2 ${m}`}>
            <label htmlFor={name} className='text-sm font-medium mb-2'>{title}</label>
            <input type="text" id={name}
                    className={`px-3 py-1 border outline-none text-sm border-task-ss-white-300 rounded-md transition-all ${ 'focus:border-task-ss-purple'}`}
                    name={name}
                    value={value}
                    onChange={e => change(e.target.value)}
            />
        </div>
    )
}

// component for textarea
export const RegularTextArea = ({ name, title, value, change, m }) => {
    return (
        <div className={`flex flex-col my-2 ${m}`}>
            <label htmlFor={name} className='text-sm font-medium mb-2'>{title}</label>
            <textarea type="text" id={name}
                    className={`px-3 py-1 border resize-none outline-none text-sm border-task-ss-white-300 rounded-md transition-all ${ 'focus:border-task-ss-purple'}`}
                    name={name}
                    value={value}
                    onChange={e => change(e.target.value)}
            ></textarea>
        </div>
    )
}

// components for dropdown (select)
export const RegularDropDown = ({ name, title, value, change, options, m }) => {
    return (
        <div className={`flex flex-col my-2 ${m}`}>
            <label htmlFor={name} className='text-sm font-medium mb-2'>{title}</label>
            <select id={name} value={value}
                    className={`px-3 py-1 border resize-none outline-none text-sm border-task-ss-white-300 rounded-md transition-all ${ 'focus:border-task-ss-red'}`}
                    name={name}
                    onChange={e => change(e.target.value)}
            >
                {options.map((option, index) => (
                    <option key={index.toString()} value={option.value}>{option.label}</option>
                ))}

            </select>
        </div>
    )
}