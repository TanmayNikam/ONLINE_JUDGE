const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const { spawn, exec } = require("child_process");
const details = {
  c: {
    compilerCmd: (id) =>
      `cd ${codeDirectory} && gcc ${id}.c -o ${id}.out -lpthread -lrt`,
    executorCmd: (id) => `cd ${codeDirectory} && ./${id}.out`,
    compiledExtension: "out",
  },
  cpp: {
    compilerCmd: (id) => `cd ${codeDirectory} && g++ ${id}.cpp -o ${id}.out`,
    executorCmd: (id) => `cd ${codeDirectory} && ./${id}.out`,
    compiledExtension: "out",
  },
  py: {
    compilerCmd: null,
    executorCmd: (id) => `cd ${codeDirectory} && python ${id}`,
    compiledExtension: "",
  },
  js: {
    compilerCmd: null,
    executorCmd: (id) => `cd ${codeDirectory} && node ${id}`,
    compiledExtension: "",
  },
  java: {
    compilerCmd: (id) => `cd ${codeDirectory} && javac ${id}.java`,
    executorCmd: (id) => `cd ${codeDirectory} && java Solution`, // TODO: Update 'java Solution', to use id
    compiledExtension: "class",
  },
};
const codeDirectory = path.join(__dirname, "../../../codeFiles");

const compile = (filename, language) => {
  const id = filename.split(".")[0];
  const command = details[language].compilerCmd
    ? details[language].compilerCmd(id)
    : null;
  return new Promise((resolve, reject) => {
    if (!command) return resolve(filename);
    exec(command, (error, stdout, stderr) => {
      error && reject({ msg: "on compile error", error, stderr });
      stderr && reject({ msg: "on compile stderr", stderr });
      resolve({ id });
    });
  });
};

const execute = (id, testInput, language) => {
  const command = details[language].executorCmd
    ? details[language].executorCmd(id)
    : null;
  return new Promise((resolve, reject) => {
    let codeOutput = "";
    // console.log("command: ", command);
    if (!command) return reject("Language Not Supported");
    const cmd = spawn(command, {
      shell: true,
    });
    cmd.on("spawn", () => {
      console.log("");
    });
    cmd.stdin.on("error", (err) => {
      //stdin not working
      reject({ msg: "on stdin error", error: `${err}` });
    });
    // console.log("testInput: ", testInput);
    cmd.stdin.write(testInput);
    cmd.stdin.end();
    cmd.stderr.on("data", (data) => {
      reject({ msg: "on execute stderr", stderr: `${data}` });
    });
    cmd.stdout.on("data", (data) => {
      codeOutput += `${data}`;
    });
    cmd.stdout.on("exit", (exitCode, signal) => {});
    cmd.on("error", (error) => {
      reject({ msg: "on error", error: `${error.name} => ${error.message}` });
    });
    cmd.on("close", (code) => {
      codeOutput = codeOutput.trim();
      resolve(codeOutput);
    });
  });
};

if (!fs.existsSync(codeDirectory)) {
  fs.mkdirSync(codeDirectory, { recursive: true });
}

const createFile = (fileExtension, content) => {
  const id = uuid();
  const filename = `${id}.${fileExtension}`;
  const filepath = path.join(codeDirectory, filename);
  fs.writeFileSync(filepath, content);
  return { filepath, filename };
};

const readFile = (filepath) => {
  if (!filepath.includes("\\") && !filepath.includes("/"))
    filepath = path.join(codeDirectory, filepath);

  if (!fs.existsSync(filepath)) return undefined;
  return fs.readFileSync(filepath);
};

const deleteFile = (filepath) => {
  if (!filepath.includes("\\") && !filepath.includes("/"))
    filepath = path.join(codeDirectory, filepath);

  if (!fs.existsSync(filepath)) return;
  fs.unlinkSync(filepath);
};

const stderrMsgFn = ({
  index,
  input,
  output,
  exOut,
}) => `Testcase ${index} Failed 
Testcase: 
${input} 
Expected Output: 
${output} 
Your Output: 
${exOut}`;

const languageErrMsg = `Please select a language / valid language.
Or may be this language is not yet supported !`;

const execCodeAgainstTestcases = (filePath, testcases, language) => {
  if (!details[language]) return { msg: languageErrMsg };

  //   let containerId = languageSpecificDetails[language].containerId();

  if (!filePath.includes("\\") && !filePath.includes("/"))
    filePath = path.join(codeDirectory, filePath);

  return new Promise(async (resolve, reject) => {
    let filename = path.basename(filePath);
    try {
      let compiledId;
      const compiled = await compile(filename, language);
      if ("stderr" in compiled) reject(compiled);
      else compiledId = compiled.id;

      let maxTime = 0;

      for (let index = 0; index < testcases.length; ++index) {
        let { input, output } = testcases[index];

        const startTime = Date.now();
        const exOut = await execute(compiledId, input, language);
        // console.log("execute: ", exOut);
        const executedTime = Date.now() - startTime;
        maxTime = Math.max(maxTime, executedTime);
        if (exOut !== output) {
          reject({
            msg: "Wrong Answer",
            time: maxTime,
            stderr: stderrMsgFn({
              index,
              input,
              output,
              exOut,
            }),
          });
          break;
        }
      }

      resolve({ msg: "Accepted", time: maxTime });
    } catch (error) {
      reject(error);
    } finally {
      try {
        if (filename) deleteFile(filename);

        if (filename && details[language].compiledExtension) {
          // TODO: Update 'Solution.class' to id.class
          deleteFile(
            language === "java"
              ? "Solution.class"
              : filename.split(".")[0] +
                  "." +
                  details[language].compiledExtension
          );
        }
      } catch (error) {
        console.error(
          "Caught some errors while deleting files from Docker Container",
          error
        );
      }
    }
  });
};

module.exports = {
  readFile,
  createFile,
  deleteFile,
  execCodeAgainstTestcases,
};
