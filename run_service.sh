#!/bin/bash

set +x
set -e

show_help() {
  echo -e "Usage:"
  echo -e "  -h|--help    |help"
  echo -e "  -a|--api_web |api_web"
  echo -e "  -a|--api_server |api_server"
  echo -e "  -p|--rest_api|rest_api"
  echo -e "  -w|--web     |web"
  echo -e "  -s|--start   |start"
  echo -e "  -k|--kill    |stop"
  echo -e "  -r|--restart |restart"
  echo -e "  -u|--status  |status"
}

create_log_path() {
  mkdir -p ${LOGS_PATH}
}

banner() {
  echo -e "Use: tail -f ${LOG_FILE} to see the log contain."
}

start_proc() {
  case $1 in
    api_web)
      PY_SRC=${ROOT_PATH}/Python/api_rest_service/api_rest_server.py
      ARGS="--api_web --dst=api_web_output"
      ;;
    api_server)
      #PY_MODULE="-m "
      PY_SRC=${ROOT_PATH}/api/main.py
      ARGS="--api_server --dst=api_server_output"
      ;;
    rest_api)
      PY_SRC=${ROOT_PATH}/Python/api_rest_service/api_rest_server.py
      #LIB_PATH=$(search_library libcrypto.so.3)
      ARGS="-p 4065"
      ;;
    web)
      WORKING_PATH=${ROOT_PATH}/Flask/templates
      pushd $WORKING_PATH
      PY_SRC="-m http.server" 
      ARGS=5001
  esac

  shift
  if [ "$1" == "nohup" ]; then
    NOHUP=$1
    shift
  fi
  
  create_log_path
  if [ ! -z "$LIB_PATH" ]; then
    export LD_LIBRARY_PATH=$LIB_PATH:$LD_LIBRARY_PATH
  fi
  ${NOHUP} ${PYTHON_BIN} ${PY_MODULE} ${PY_SRC} ${ARGS} $* > ${LOG_FILE} 2>&1 &
  banner
}

stop_proc() {
  case $1 in
    api_web)
      ARGS=api_web
      ;;
    api_server)
      ARGS=api_server
      ;;
    rest_api)
      ARGS=api_rest_server
      EXCLUDE=api_web
      ;;
    web)
      ARGS=http.server
  esac

  APP_NAME=python
  set +e
  if [ -z "$EXCLUDE" ]; then
    PID_PROC=$(ps -u | grep $APP_NAME | grep $ARGS | awk -F ' ' '{print $2}')
  else
    PID_PROC=$(ps -u | grep $APP_NAME | grep $ARGS | grep -v $EXCLUDE | awk -F ' ' '{print $2}')
  fi
  set -e

  PID_PROC=$(get_pidof $1 | awk -F ' ' '{print $3}')

  if [ ! -z "$PID_PROC" ]; then
    for PID in $PID_PROC
    do
      kill -9 $PID
    done
  fi
}

get_pidof() {
  case $1 in
    api_web)
      ARGS=api_web
      ;;
    api_server)
      ARGS=api_server
      ;;
    rest_api)
      ARGS=api_rest_server
      EXCLUDE=api_web
      ;;
    web)
      ARGS=http.server
  esac

  APP_NAME=python
  #killproc ${ROOT_PATH}/build/bin/${TARGET}/main_control
  set +e
  #PID_PROC=$(pidof python | grep $ARGS)
  if [ -z "$EXCLUDE" ]; then
    PIDOF_PROC=$(ps all -u $USER | grep $APP_NAME | grep $ARGS)
  else
    PIDOF_PROC=$(ps all -u $USER | grep $APP_NAME | grep $ARGS | grep -v $EXCLUDE)
  fi
  set -e
  echo -e $PIDOF_PROC
}

status_proc() {
  pidof_service=$(get_pidof $1)
  echo -e "$1 service:"
  if [ ! -z "$pidof_service" ]; then
    echo -e "${pidof_service}"
  else
    echo -e "Service stopped"
  fi
}

search_library() {
  set +e
  LIB_FILEPATH=$(find / -name $1 -print -quit 2>/dev/null)
  set -e
  if [ ! -z "$LIB_FILEPATH" ]; then
    LIB_PATH=$(dirname "$(readlink -f "$LIB_FILEPATH")")
  fi
  echo $LIB_PATH
}


# --- main -----

TARGET=Debug

ROOT_PATH=$(dirname "$(readlink -f "$BASH_SOURCE")")
SPD_ROOT=$(dirname "$(readlink -f "$ROOT_PATH")")

BASEPATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ ! -z "$LIB_PATH" ]; then
  LIB_PATH=${BASEPATH}/Python/api_rest_service:$LIB_PATH
else
  LIB_PATH=${BASEPATH}/Python/api_rest_service
fi

export LD_LIBRARY_PATH=$LIB_PATH:$LD_LIBRARY_PATH

if [ -z "$PYTHON_ENV_ROOT" ]; then
  PYTHON_ENV_ROOT=$(find $SPD_ROOT -name pythonEnv)
fi

if [ ! -z "$PYTHON_ENV_ROOT" ]; then
	source $PYTHON_ENV_ROOT/bin/activate
	PYTHON_BIN=python
else
  set +e
	PYTHON_BIN=$(which python3)
  set -e
	if [ -z "$PYTHON_BIN" ]; then
		echo -e "Python not found. Please set PYTHON_ENV_ROOT env. Exiting with error."
		exit 1
	fi
fi

if [ -z "$PYTHON_BIN" ]; then
  echo -e "Python not found. Please set PYTHON_ENV_ROOT env. Exiting with error."
  exit 1
fi

SERVICE_NAME=

ACTION="nohup"

LOGS_PATH=${ROOT_PATH}/logs

while [[ $# -gt 0 ]]; do
  case $1 in
    -h|--help|help)
      show_help
      exit 0
      ;;
    -a|--api_web|api_web)
      SERVICE_NAME=api_web
      ;;
    -a|--api_server|api_server)
      SERVICE_NAME=api_server
      ;;
    -p|--rest_api|rest_api)
      SERVICE_NAME=rest_api
      ;;
    -w|--web|web)
      SERVICE_NAME=web
      ;;
    -s|--start|start)
      ACTION="start"
      ;;
    -k|--kill|stop)
      ACTION="stop"
      ;;
    -r|--restart|restart)
      ACTION="restart"
      ;;
    -u|--status|status)
      ACTION="status"
      ;;
    -*|--*)
      #echo "Unknown option $1"
      #exit 1
      
      POSITIONAL_ARGS+=("$1") # save positional arg
      echo -e "ARG=$1, POSITIONAL_ARGS=${POSITIONAL_ARGS}"
      ;;
    *)
      POSITIONAL_ARGS="$POSITIONAL_ARGS $1" # save positional arg
      echo -e "ARG=$1, POSITIONAL_ARGS=${POSITIONAL_ARGS}"
      #shift # past argument
      ;;
  esac
  shift # past argument
done

LOG_FILE=${LOGS_PATH}/${SERVICE_NAME}.log

if [ -z "$SERVICE_NAME" ]; then
  echo -e "Service option missed (-a, -p, -w)"
  show_help
  exit 1
fi

# Execution
case $ACTION in
  start)
    stop_proc ${SERVICE_NAME}
    echo -e "POSITIONAL_ARGS=${POSITIONAL_ARGS}"
    start_proc ${SERVICE_NAME} ${POSITIONAL_ARGS}
    ;;
  stop)
    stop_proc ${SERVICE_NAME}
    status_proc ${SERVICE_NAME}
    ;;
  restart)
    start_proc ${SERVICE_NAME}
    ;;
  status)
    status_proc ${SERVICE_NAME}
    ;;
  nohup)
    start_proc ${SERVICE_NAME} nohup
    ;;
esac
